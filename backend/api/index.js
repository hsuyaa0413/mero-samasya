import express from 'express';
import authRoutes from './routes/auth.route.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
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
app.use(express.json());

app.listen(8000, () => {
  console.log('Server is running in port 8000');
});

app.use('/api/auth', authRoutes);
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
