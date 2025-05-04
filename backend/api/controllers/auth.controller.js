import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const register = async (req, res, next) => {
  const {
    name,
    email,
    phoneNumber,
    password,
    confirmPassword,
    address,
    role,
    localBody,
    idCard,
  } = req.body;
  const newUser = new User({
    name,
    email,
    phoneNumber,
    password,
    confirmPassword,
    address,
    role,
    localBody,
    idCard,
  });
  try {
    await newUser.save();
    res
      .status(201)
      .json({ status: 'success', message: 'User created successfully!' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, 'User not found!'));

    const validPassword = await validUser.matchPassword(password);
    if (!validPassword) return next(errorHandler(400, 'Invalid credentials!'));

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
