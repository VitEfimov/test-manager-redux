require('dotenv').config({ path: './.env' });
const express = require('express');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

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
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth) return res.status(401).json({ message: 'No token provided' });
    const token = auth.split(' ')[1];
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
        res.status(201).json({ token });
    } catch (e) {
        res.status(500).json({ message: 'Database Error' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.collection('users').findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
        
        const token = jwt.sign({ userId: user._id, email }, SECRET, { expiresIn: '7d' });
        res.status(200).json({ token });
    } catch (e) {
        res.status(500).json({ message: 'Database Error' });
    }
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
