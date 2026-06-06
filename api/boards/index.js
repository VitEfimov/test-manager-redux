import clientPromise from '../../lib/mongodb.js';
import { verifyToken } from '../../lib/auth.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;

    const { id, name } = req.body;

    const client = await clientPromise;
    const db = client.db('task_manager');

    const user = await db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user.boards || user.boards.length === 0) {
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $set: { boards: [{ id: 'main', name: 'Main' }, { id, name }] } }
        );
    } else {
        await db.collection('users').updateOne(
            { _id: new ObjectId(userId) },
            { $push: { boards: { id, name } } }
        );
    }

    return res.status(201).json({ id, name });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}
