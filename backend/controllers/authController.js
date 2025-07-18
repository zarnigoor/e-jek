import User from '../models/User.js';
import Admin from '../models/Admin.js';
import { signToken } from '../config/jwt.js';
import { validationResult } from 'express-validator';

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { login, password } = req.body;

  try {
    let user = await User.findOne({ login });
    let userType = 'user';

    if (!user) {
      user = await Admin.findOne({ login });
      userType = 'admin';
    }

    if (user && (await user.matchPassword(password))) {
      const token = signToken({ id: user._id, role: user.role });
      res.cookie('token', token, { httpOnly: true, secure:true, sameSite:"none",maxAge: 30 * 24 * 60 * 60 * 1000 });
      res.json({
        _id: user._id,
        login: user.login,
        role: user.role,
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    // secure:true,
    // sameSite:"none",
    expires: new Date(0),
  });
  res.status(200).json({ message: 'Logged out successfully' });
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      const admin = await Admin.findById(req.user.id).select('-password');
      if (admin) {
        res.json(admin);
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
