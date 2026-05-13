import University from '../models/University.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { cloudinary } from '../config/cloudinary.js';

export const createUniversity = asyncHandler(async (req, res) => {
  const { name, country, city, ranking, website, description } = req.body;
  const data = { name, country, city, ranking, website, description };

  if (req.file) {
    data.logo = { url: req.file.path, publicId: req.file.filename };
  }

  const university = await University.create(data);
  res.status(201).json(new ApiResponse(201, university, 'University created'));
});

export const getAllUniversities = asyncHandler(async (req, res) => {
  const { country, search, isActive, page = 1, limit = 10 } = req.query;
  const filter = {};

  if (country) filter.country = { $regex: country, $options: 'i' };
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) filter.name = { $regex: search, $options: 'i' };

  const skip = (Number(page) - 1) * Number(limit);
  const [universities, total] = await Promise.all([
    University.find(filter).skip(skip).limit(Number(limit)).sort({ name: 1 }),
    University.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(
      200,
      { universities, total, page: Number(page), totalPages: Math.ceil(total / Number(limit)) },
      'Universities fetched'
    )
  );
});

export const getUniversityById = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) throw new ApiError(404, 'University not found');
  res.json(new ApiResponse(200, university, 'University fetched'));
});

export const updateUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) throw new ApiError(404, 'University not found');

  const updates = { ...req.body };

  if (req.file) {
    if (university.logo?.publicId) {
      await cloudinary.uploader.destroy(university.logo.publicId);
    }
    updates.logo = { url: req.file.path, publicId: req.file.filename };
  }

  const updated = await University.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  res.json(new ApiResponse(200, updated, 'University updated'));
});

export const deleteUniversity = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);
  if (!university) throw new ApiError(404, 'University not found');

  if (university.logo?.publicId) {
    await cloudinary.uploader.destroy(university.logo.publicId);
  }

  await university.deleteOne();
  res.json(new ApiResponse(200, {}, 'University deleted'));
});
