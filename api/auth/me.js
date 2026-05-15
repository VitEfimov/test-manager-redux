import { verifyToken } from '../../lib/auth.js';

export default function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const user = verifyToken(req);
    res.status(200).json({ email: user.email });
  } catch (err) {
    res.status(401).json({ message: 'Not authenticated' });
  }
}
