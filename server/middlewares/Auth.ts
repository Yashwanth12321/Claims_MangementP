import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const auth = (roles = []) => (req:any, res:any, next:any) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET!);
    req.user = decoded;
    if (roles.length && !roles.includes(decoded.role)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export default auth;
