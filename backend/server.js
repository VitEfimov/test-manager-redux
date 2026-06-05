require('dotenv').config({ path: './.env' });
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

const app = express();
app.use(express.json());
app.use(cookieParser());

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error("MONGO_URI not found in .env");
    process.exit(1);
}

const client = new MongoClient(uri, { autoSelectFamily: false });
let db;

client.connect().then(() => {
    db = client.db('task_manager');
    console.log("Connected to MongoDB Successfully!");
}).catch((err) => {
    console.error("Failed to connect to MongoDB", err);
});

const SECRET = process.env.JWT_SECRET || 'super_secret_dev_key';

const verifyToken = (req, res, next) => {
    const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
    if (!token) return res.status(401).json({ message: 'No token provided' });
    try {
        req.user = jwt.verify(token, SECRET);
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        const existing = await db.collection('users').findOne({ email });
        if (existing) return res.status(400).json({ message: 'User exists' });
        
        const hashed = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({ 
            email, 
            password: hashed,
            boards: [{ id: 'main', name: 'Main' }]
        });
        const token = jwt.sign({ userId: result.insertedId, email }, SECRET, { expiresIn: '7d' });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };
        res.cookie('token', token, cookieOptions);

        res.status(201).json({ email });
    } catch (e) {
        res.status(500).json({ message: 'Database Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password, rememberMe } = req.body;
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const jwtExpiry = rememberMe ? '7d' : '1d';
        const token = jwt.sign({ userId: user._id, email }, SECRET, { expiresIn: jwtExpiry });

        const cookieOptions = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        };

        if (rememberMe) {
            cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;
        }

        let boards = user.boards;
        if (!boards || boards.length === 0) {
            boards = [{ id: 'main', name: 'Main' }];
        } else if (!boards.find(b => b.id === 'main')) {
            boards = [{ id: 'main', name: 'Main' }, ...boards];
            db.collection('users').updateOne({ email }, { $set: { boards } });
        }

        res.cookie('token', token, cookieOptions);
        res.status(200).json({ email: user.email, boards });
    } catch (e) {
        res.status(500).json({ message: 'Database Error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', verifyToken, async (req, res) => {
    const user = await db.collection('users').findOne({ email: req.user.email });
    let boards = user?.boards;
    if (!boards || boards.length === 0) {
        boards = [{ id: 'main', name: 'Main' }];
    } else if (!boards.find(b => b.id === 'main')) {
        boards = [{ id: 'main', name: 'Main' }, ...boards];
        db.collection('users').updateOne({ email: req.user.email }, { $set: { boards } });
    }
    res.status(200).json({ email: req.user.email, boards });
});

app.get('/api/tasks', verifyToken, async (req, res) => {
    const tasks = await db.collection('tasks').find({ userId: req.user.userId }).toArray();
    res.status(200).json(tasks);
});

app.post('/api/tasks', verifyToken, async (req, res) => {
    const task = req.body;
    const result = await db.collection('tasks').insertOne({ ...task, userId: req.user.userId });
    res.status(201).json({ ...task, _id: result.insertedId, userId: req.user.userId });
});

app.post('/api/tasks/bulk', verifyToken, async (req, res) => {
    const tasks = req.body.tasks; // Array of task objects
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ message: 'Invalid tasks array' });
    }
    const tasksWithUserId = tasks.map(task => ({ ...task, userId: req.user.userId }));
    const result = await db.collection('tasks').insertMany(tasksWithUserId);
    res.status(201).json({ insertedCount: result.insertedCount });
});

app.put('/api/tasks/:id', verifyToken, async (req, res) => {
    const updates = req.body;
    delete updates._id;
    delete updates.userId;
    const result = await db.collection('tasks').updateOne(
        { id: req.params.id, userId: req.user.userId },
        { $set: updates }
    );
    res.status(200).json(result);
});

app.delete('/api/tasks/:id', verifyToken, async (req, res) => {
    const result = await db.collection('tasks').deleteOne({
        id: req.params.id,
        userId: req.user.userId
    });
    res.status(200).json(result);
});

app.post('/api/boards', verifyToken, async (req, res) => {
    try {
        const { id, name } = req.body;
        const { ObjectId } = require('mongodb');
        
        if (!req.user || !req.user.userId) {
            return res.status(400).json({ message: "Invalid user token: missing userId. Please log out and log back in." });
        }

        const user = await db.collection('users').findOne({ _id: new ObjectId(req.user.userId) });
        if (!user.boards || user.boards.length === 0) {
            await db.collection('users').updateOne(
                { _id: new ObjectId(req.user.userId) },
                { $set: { boards: [{ id: 'main', name: 'Main' }, { id, name }] } }
            );
        } else {
            await db.collection('users').updateOne(
                { _id: new ObjectId(req.user.userId) },
                { $push: { boards: { id, name } } }
            );
        }
        res.status(201).json({ id, name });
    } catch (e) {
        console.error('Error in POST /api/boards:', e);
        res.status(500).json({ message: e.message });
    }
});

app.put('/api/boards/:id', verifyToken, async (req, res) => {
    const { name } = req.body;
    const { ObjectId } = require('mongodb');
    await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId), "boards.id": req.params.id },
        { $set: { "boards.$.name": name } }
    );
    res.status(200).json({ id: req.params.id, name });
});

app.delete('/api/boards/:id', verifyToken, async (req, res) => {
    const { ObjectId } = require('mongodb');
    await db.collection('users').updateOne(
        { _id: new ObjectId(req.user.userId) },
        { $pull: { boards: { id: req.params.id } } }
    );
    await db.collection('tasks').deleteMany({
        userId: req.user.userId,
        boardId: req.params.id
    });
    res.status(200).json({ id: req.params.id });
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
