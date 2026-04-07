import jwt from 'jsonwebtoken';

const SECRET = process.env.JWT_SECRET;

export const createToken = (user) => {
  return jwt.sign(
    { userId: user._id, email: user.email },
    SECRET,
    { expiresIn: '7d' }
  );
};

export const verifyToken = (req) => {
  const auth = req.headers.authorization || req.headers?.Authorization;

  if (!auth) throw new Error('No token provided');

  const token = auth.split(' ')[1];
  return jwt.verify(token, SECRET);
};
