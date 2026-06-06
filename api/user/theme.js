import clientPromise from '../../lib/mongodb.js';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'PUT') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const decoded = verifyToken(req);
    const { theme } = req.body;

    if (!['light', 'dark', 'system'].includes(theme)) {
      return res.status(400).json({ message: 'Invalid theme value' });
    }

    const client = await clientPromise;
    const db = client.db('task_manager');
    
    await db.collection('users').updateOne(
        { email: decoded.email },
        { $set: { theme } }
    );

    return res.status(200).json({ theme });
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', error: err.message });
  }
}
