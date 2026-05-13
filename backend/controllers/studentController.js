import User from '../models/User.js';
import Application from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getAllStudents = asyncHandler(async (req, res) => {
  const { search, isActive, page = 1, limit = 10 } = req.query;
  const filter = { role: 'student' };

  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  // Counselors can only see their assigned students
  if (req.user.role === 'counselor') {
    const assignedStudentIds = await Application.distinct('student', {
      counselor: req.user._id,
    });
    filter._id = { $in: assignedStudentIds };
  }

  const skip = (Number(page) - 1) * Number(limit);
  const [students, total] = await Promise.all([
    User.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(
      200,
      { students, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
      'Students fetched'
    )
  );
});

export const getStudentById = asyncHandler(async (req, res) => {
  const student = await User.findOne({ _id: req.params.id, role: 'student' });
  if (!student) throw new ApiError(404, 'Student not found');

  // Counselor can only view their assigned students
  if (req.user.role === 'counselor') {
    const assigned = await Application.exists({
      student: req.params.id,
      counselor: req.user._id,
    });
    if (!assigned) throw new ApiError(403, 'This student is not assigned to you');
  }

  res.json(new ApiResponse(200, student, 'Student fetched'));
});

export const getMyProfile = asyncHandler(async (req, res) => {
  res.json(new ApiResponse(200, req.user, 'Profile fetched'));
});

export const getMyCounselor = asyncHandler(async (req, res) => {
  const latestApplication = await Application.findOne({ student: req.user._id })
    .populate('counselor', 'name email phone avatar')
    .sort({ createdAt: -1 });

  res.json(
    new ApiResponse(200, latestApplication?.counselor || null, 'Counselor info fetched')
  );
});
