import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET;
const expiresIn = '30d';

export const signToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    return null;
  }
};
