import clientPromise from '../../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const client = await clientPromise;
  const db = client.db('task_manager');

  const { email, password, rememberMe } = req.body;

  const user = await db.collection('users').findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = createToken(user);

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/'
  };

  if (rememberMe) {
    cookieOptions.maxAge = 60 * 60 * 24 * 7; // 7 days
  }

  const { serialize } = require('cookie');
  res.setHeader('Set-Cookie', serialize('token', token, cookieOptions));

  res.status(200).json({ email: user.email });
}
