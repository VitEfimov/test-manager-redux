import clientPromise from '../../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const client = await clientPromise;
  const db = client.db('task_manager');

  const { email, password } = req.body;

  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = createToken(user);

  res.status(200).json({ token });
}
