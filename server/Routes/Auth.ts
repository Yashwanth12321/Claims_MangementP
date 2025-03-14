import express from 'express'
const router = express.Router();
import User from '../Schema/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register User
router.post('/register', async (req:any, res:any) => {
  const { name, email, password, role } = req.body;
  try {
    const newUser = new User({ name, email, password, role });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

// Login User
router.post('/login', async (req:any, res:any) => {
    console.log(req.body)
  const { email, password } = req.body;
  const user = await User.findOne({ email});
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET!, { expiresIn: '200h' });
  res.json({ token ,user:{name: user.name, email: user.email, role: user.role} });
});

export default router;
