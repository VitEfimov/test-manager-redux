import clientPromise from '../../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const userPayload = verifyToken(req);

    const client = await clientPromise;
    const db = client.db('task_manager');

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current and new passwords are required' });
    }

    const user = await db.collection('users').findOne({ email: userPayload.email });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await db.collection('users').updateOne(
      { email: userPayload.email },
      { $set: { password: hashed } }
    );

    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(401).json({ message: 'Unauthorized or invalid token' });
  }
}
