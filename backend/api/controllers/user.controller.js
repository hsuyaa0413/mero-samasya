import User from '../models/user.model.js';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      message: 'Users fetched successfully!',
      users,
    });
  } catch (e) {
    console.error('Error fetching users:', e);
  }
};
