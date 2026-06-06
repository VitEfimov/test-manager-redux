import { verifyToken } from '../../lib/auth.js';
import clientPromise from '../../lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const decoded = verifyToken(req);
    const client = await clientPromise;
    const db = client.db('task_manager');
    const user = await db.collection('users').findOne({ email: decoded.email });

    let boards = user?.boards;
    if (!boards || boards.length === 0) {
        boards = [{ id: 'main', name: 'Main' }];
    } else if (!boards.find(b => b.id === 'main')) {
        boards = [{ id: 'main', name: 'Main' }, ...boards];
        await db.collection('users').updateOne({ email: decoded.email }, { $set: { boards } });
    }

    const theme = user.theme || 'light';

    res.status(200).json({ email: decoded.email, boards, theme });
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
  }
}
