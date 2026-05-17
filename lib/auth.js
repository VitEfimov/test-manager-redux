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
  const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);

  if (!token) throw new Error('No token provided');

  return jwt.verify(token, SECRET);
};
