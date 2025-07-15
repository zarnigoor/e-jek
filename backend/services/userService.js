import User from '../models/User.js';

export const createUser = async (data) => {
  const { login, password, dom, uy, name } = data;
  const userExists = await User.findOne({ login });

  if (userExists) {
    throw new Error('User already exists');
  }

  const user = new User({
    login,
    password,
    dom,
    uy,
    name,
  });

  return await user.save();
};

export const getAllUsers = async () => {
  return await User.find({ role: 'user' }).select('-password');
};

export const searchUsers = async (searchTerm) => {
  const query = {};
  if (searchTerm) {
    query.$or = [
      { login: { $regex: searchTerm, $options: 'i' } },
      { name: { $regex: searchTerm, $options: 'i' } },
    ];
  }
  return await User.find({ ...query, role: 'user' }).select('-password');
};

export const updateUserPassword = async (userId, newPassword) => {
  const user = await User.findById(userId);
  if (user) {
    user.password = newPassword;
    await user.save();
  } else {
    throw new Error('User not found');
  }
};

