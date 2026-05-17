import clientPromise from '../../lib/mongodb.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    const client = await clientPromise;
    const db = client.db('task_manager');

    if (req.method === 'GET') {
      const tasks = await db.collection('tasks').find({ userId }).toArray();
      return res.status(200).json(tasks);
    } 
    
    if (req.method === 'POST') {
      const task = req.body;
      const result = await db.collection('tasks').insertOne({
        ...task,
        userId
      });
      return res.status(201).json({ ...task, _id: result.insertedId, userId });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}
