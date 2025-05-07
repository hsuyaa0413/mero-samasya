import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export const register = async (req, res, next) => {
  const {
    fullName,
    email,
    phoneNumber,
    password,
    confirmPassword,
    address,
    role,
    localBody,
    idCard,
  } = req.body;

  if (
    !fullName ||
    !email ||
    !phoneNumber ||
    !password ||
    !confirmPassword ||
    !address
  ) {
    return next(errorHandler(400, 'All fields are required!'));
  }

  if (password !== confirmPassword) {
    return next(errorHandler(400, 'Passwords do not match!'));
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phoneNumber }],
  });
  if (existingUser) {
    return next(
      errorHandler(400, 'User with this email or phone number already exists!')
    );
  }

  const newUser = new User({
    fullName,
    email,
    phoneNumber,
    password, 
    address,
    role,
    localBody,
    idCard,
  });

  try {
    await newUser.save();
    res
      .status(200)
      .json({ status: 'success', message: 'User created successfully!' });
  } catch (error) {
    console.error('Error during user creation:', error); 
    next(error); 
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  console.log('Login request:', { email, password });

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));
    const validPassword = await validUser.matchPassword(password);
    if (!validPassword) return next(errorHandler(400, 'Password does not match!'));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie('jwt', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: 'strict',
      })
      .status(200)
      .json({ status: 'success', message: 'Login successful!', user: rest });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res
      .cookie('jwt', '', {
        expires: new Date(Date.now() - 1000),
        httpOnly: true,
      })
      .status(200)
      .json({
        status: 'success',
        message: 'Logged out successfully!',
      });
  } catch (error) {
    next(error);
  }
};
