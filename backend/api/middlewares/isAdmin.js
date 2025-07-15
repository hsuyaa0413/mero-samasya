import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { errorHandler } from '../utils/error.js';
import User from '../models/user.model.js';

export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token)
      return next(
        errorHandler(401, 'You are not logged in! Please login to get access')
      );

    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (currentUser.role !== 'admin') {
      return next(errorHandler(401, 'Only admin can perform this action!'));
    }

    next();
  } catch (error) {
    next(error);
  }
};
