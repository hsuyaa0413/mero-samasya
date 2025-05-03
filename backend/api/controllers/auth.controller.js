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
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json({ status: 'success', user: rest, message: 'Login successful!' });
  } catch (error) {
    next(error);
  }
};
