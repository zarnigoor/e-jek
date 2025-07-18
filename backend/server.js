import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import applicationRoutes from './routes/applications.js';
import adminRoutes from './routes/admin.js';
import Admin from './models/Admin.js';

dotenv.config();
connectDB();

const app = express();

app.use(cors({
  origin: 'https://jekbek.vercel.app',
  credentials: true,
}));

app.use(cors())
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Create default admin
const createDefaultAdmin = async () => {
  try {
    const adminExists = await Admin.findOne({ login: process.env.ADMIN_LOGIN });
    if (!adminExists) {
      const admin = new Admin({
        login: process.env.ADMIN_LOGIN,
        password: process.env.ADMIN_PASSWORD,
      });
      await admin.save();
      console.log('Default admin created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

createDefaultAdmin();
