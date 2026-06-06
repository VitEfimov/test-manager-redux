import clientPromise from '../../lib/mongodb.js';
import { verifyToken } from '../../lib/auth.js';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const decoded = verifyToken(req);
    const userId = decoded.userId;
    const { id } = req.query;

    const client = await clientPromise;
    const db = client.db('task_manager');

    if (req.method === 'PUT' || req.method === 'PATCH') {
      const { name } = req.body;
      await db.collection('users').updateOne(
          { _id: new ObjectId(userId), "boards.id": id },
          { $set: { "boards.$.name": name } }
      );
      return res.status(200).json({ id, name });
    }

    if (req.method === 'DELETE') {
      await db.collection('users').updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { boards: { id: id } } }
      );
      await db.collection('tasks').deleteMany({
          userId: userId,
          boardId: id
      });
      return res.status(200).json({ id });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}
