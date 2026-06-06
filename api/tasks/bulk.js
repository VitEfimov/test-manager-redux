import clientPromise from '../../lib/mongodb.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    const client = await clientPromise;
    const db = client.db('task_manager');

    const tasks = req.body.tasks;
    if (!tasks || !Array.isArray(tasks) || tasks.length === 0) {
        return res.status(400).json({ message: 'Invalid tasks array' });
    }

    const tasksWithUserId = tasks.map(task => ({ ...task, userId }));
    const result = await db.collection('tasks').insertMany(tasksWithUserId);

    return res.status(201).json({ insertedCount: result.insertedCount });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}
