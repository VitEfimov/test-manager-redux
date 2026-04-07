import clientPromise from '../../lib/mongodb.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;
    const { id } = req.query;

    const client = await clientPromise;
    const db = client.db('task_manager');

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const updates = req.body;
      delete updates._id; // prevent modifying _id
      delete updates.userId; // prevent modifying userId

      const result = await db.collection('tasks').updateOne(
        { id: id, userId },
        { $set: updates }
      );
      return res.status(200).json(result);
    }

    if (req.method === 'DELETE') {
      const result = await db.collection('tasks').deleteOne({
        id: id,
        userId
      });
      return res.status(200).json(result);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}
