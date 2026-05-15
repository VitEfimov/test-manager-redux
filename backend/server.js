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
        const result = await db.collection('users').insertOne({ email, password: hashed });
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

        res.cookie('token', token, cookieOptions);
        res.status(200).json({ email: user.email });
    } catch (e) {
        res.status(500).json({ message: 'Database Error' });
    }
});

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out successfully' });
});

app.get('/api/auth/me', verifyToken, (req, res) => {
    res.status(200).json({ email: req.user.email });
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

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
