import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.route.js';
import reportRoutes from './routes/report.route.js';
dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch(err => {
    console.log('Error connecting to MongoDB:', err.message);
  });

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions = {
  origin: process.env.NEXT_FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use('/api/auth', authRoutes);
app.use('/api/report', reportRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.listen(8000, () => {
  console.log('Server is running in port 8000');
});
