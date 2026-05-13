import SuccessStory from '../models/SuccessStory.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const createSuccessStory = asyncHandler(async (req, res) => {
  const { title, student, program, country, year, ytId, initials } = req.body;

  const story = await SuccessStory.create({
    title, student, program, country, year, ytId, initials,
    createdBy: req.user._id,
  });

  res.status(201).json(new ApiResponse(201, story, 'Success story created'));
});

export const getAllSuccessStories = asyncHandler(async (req, res) => {
  const isStaff = req.user && ['admin', 'counselor'].includes(req.user.role);
  const filter = isStaff ? {} : { isActive: true };

  const stories = await SuccessStory.find(filter)
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, stories, 'Success stories fetched'));
});

export const updateSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findById(req.params.id);
  if (!story) throw new ApiError(404, 'Success story not found');

  const updated = await SuccessStory.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json(new ApiResponse(200, updated, 'Success story updated'));
});

export const deleteSuccessStory = asyncHandler(async (req, res) => {
  const story = await SuccessStory.findById(req.params.id);
  if (!story) throw new ApiError(404, 'Success story not found');

  await story.deleteOne();
  res.json(new ApiResponse(200, {}, 'Success story deleted'));
});
