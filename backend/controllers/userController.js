import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const buildFilter = ({ role, isActive, search }) => {
  const filter = {};
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }
  return filter;
};

export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, ...filterParams } = req.query;
  const filter = buildFilter(filterParams);
  const skip = (Number(page) - 1) * Number(limit);

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(
      200,
      { users, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
      'Users fetched'
    )
  );
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, user, 'User fetched'));
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }

  if (await User.findOne({ email })) {
    throw new ApiError(409, 'User with this email already exists');
  }

  const user = await User.create({ name, email, password, role, phone });
  res.status(201).json(new ApiResponse(201, user, 'User created'));
});

export const updateUser = asyncHandler(async (req, res) => {
  const { name, email, role, phone, isActive } = req.body;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { name, email, role, phone, isActive },
    { new: true, runValidators: true }
  );

  if (!user) throw new ApiError(404, 'User not found');
  res.json(new ApiResponse(200, user, 'User updated'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  res.json(new ApiResponse(200, {}, 'User deleted'));
});

export const toggleUserStatus = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot deactivate your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');

  user.isActive = !user.isActive;
  await user.save({ validateBeforeSave: false });

  res.json(
    new ApiResponse(200, user, `User account ${user.isActive ? 'activated' : 'deactivated'}`)
  );
});
