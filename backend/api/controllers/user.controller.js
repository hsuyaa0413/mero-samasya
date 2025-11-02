import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      message: 'Users fetched successfully!',
      users,
    });
  } catch (e) {
    console.error('Error fetching users:', e);
    next(e);
  }
};

export const approveAuthority = async (req, res, next) => {
  const authorityId = req.params.id;

  try {
    const authority = await User.findByIdAndUpdate(
      authorityId,
      {
        approved: true,
        rejectedByAdmin: false,
      },
      {
        new: true,
      }
    );

    if (!authority) next(errorHandler(404, 'User not found!'));

    return res.status(200).json({
      status: 'success',
      message: 'Authority approved successfully!',
      authority,
    });
  } catch (e) {
    next(errorHandler(e.status || 500, e.message || 'Server error'));
  }
};

export const rejectAuthority = async (req, res, next) => {
  const authorityId = req.params.id;

  try {
    const authority = await User.findByIdAndUpdate(
      authorityId,
      {
        approved: false,
        rejectedByAdmin: true,
      },
      {
        new: true,
      }
    );

    if (!authority) next(errorHandler(404, 'User not found!'));

    return res.status(200).json({
      status: 'success',
      message: 'Authority rejected successfully!',
      authority,
    });
  } catch (e) {
    next(errorHandler(e.status || 500, e.message || 'Server error'));
  }
};

export const deleteUser = async (req, res, next) => {
  const userId = req.params.id;

  try {
    const user = await User.findByIdAndDelete(userId);

    if (!user) return next(errorHandler(404, 'User not found!'));

    return res.status(200).json({
      status: 'success',
      message: 'User deleted successfully!',
    });
  } catch (e) {
    next(errorHandler(e.status || 500, e.message || 'Server error'));
  }
};