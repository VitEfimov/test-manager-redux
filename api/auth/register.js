import clientPromise from '../../lib/mongodb.js';
import bcrypt from 'bcryptjs';
import { createToken } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  const client = await clientPromise;
  const db = client.db('task_manager');

  const { email, password } = req.body;

  const existing = await db.collection('users').findOne({ email });
  if (existing) {
    return res.status(400).json({ message: 'User exists' });
  }

  const hashed = await bcrypt.hash(password, 10);

  const result = await db.collection('users').insertOne({
    email,
    password: hashed,
  });

  const user = { _id: result.insertedId, email };

  const token = createToken(user);

  res.status(201).json({ token });
}
