import Course from '../models/Course.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create(req.body);
  await course.populate('university', 'name country');
  res.status(201).json(new ApiResponse(201, course, 'Course created'));
});

export const getAllCourses = asyncHandler(async (req, res) => {
  const { university, level, search, isActive, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (university) filter.university = university;
  if (level) filter.level = level;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) filter.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [courses, total] = await Promise.all([
    Course.find(filter)
      .populate('university', 'name country')
      .skip(skip)
      .limit(Number(limit))
      .sort({ name: 1 }),
    Course.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(
      200,
      { courses, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
      'Courses fetched'
    )
  );
});

export const getCoursesByUniversity = asyncHandler(async (req, res) => {
  const courses = await Course.find({
    university: req.params.universityId,
    isActive: true,
  })
    .populate('university', 'name')
    .sort({ name: 1 });

  res.json(new ApiResponse(200, courses, 'Courses fetched'));
});

export const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate('university');
  if (!course) throw new ApiError(404, 'Course not found');
  res.json(new ApiResponse(200, course, 'Course fetched'));
});

export const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('university', 'name country');

  if (!course) throw new ApiError(404, 'Course not found');
  res.json(new ApiResponse(200, course, 'Course updated'));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) throw new ApiError(404, 'Course not found');
  res.json(new ApiResponse(200, {}, 'Course deleted'));
});
