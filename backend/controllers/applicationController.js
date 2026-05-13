import mongoose from 'mongoose';
import Application, { APPLICATION_STATUSES } from '../models/Application.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const POPULATE_FIELDS = [
  { path: 'student', select: 'name email phone profilePhoto' },
  { path: 'counselor', select: 'name email profilePhoto' },
  { path: 'university', select: 'name country city logo' },
  { path: 'course', select: 'name level duration tuitionFee' },
  { path: 'statusHistory.changedBy', select: 'name role' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const buildFilter = (query, userRole, userId) => {
  const { status, counselorId, universityId, studentId, dateFrom, dateTo, search } = query;
  const filter = {};

  if (status) {
    // Support comma-separated multi-status: ?status=Inquiry,Applied
    const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
    filter.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
  }

  if (universityId) filter.university = universityId;
  if (studentId) filter.student = studentId;

  if (userRole === 'counselor') {
    filter.counselor = userId;
  } else if (counselorId) {
    filter.counselor = counselorId;
  }

  if (dateFrom || dateTo) {
    filter.createdAt = {};
    if (dateFrom) filter.createdAt.$gte = new Date(dateFrom);
    if (dateTo) filter.createdAt.$lte = new Date(new Date(dateTo).setHours(23, 59, 59, 999));
  }

  return filter;
};

// ─── Controllers ──────────────────────────────────────────────────────────────

export const createApplication = asyncHandler(async (req, res) => {
  const {
    student,
    university,
    course,
    intakeYear,
    intakeMonth,
    notes,
    priority,
    counselor,
  } = req.body;

  if (!student || !university || !course || !intakeYear || !intakeMonth) {
    throw new ApiError(400, 'student, university, course, intakeYear, and intakeMonth are required');
  }

  const assignedCounselor =
    req.user.role === 'counselor' ? req.user._id : counselor || null;

  const application = await Application.create({
    student,
    university,
    course,
    intakeYear,
    intakeMonth,
    notes,
    priority: priority || 'medium',
    counselor: assignedCounselor,
    statusHistory: [{ status: 'Inquiry', changedBy: req.user._id, date: new Date() }],
  });

  await application.populate(POPULATE_FIELDS);
  res.status(201).json(new ApiResponse(201, application, 'Application created'));
});

export const getAllApplications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, sort = '-createdAt', ...filterParams } = req.query;

  const filter = buildFilter(filterParams, req.user.role, req.user._id);
  const skip = (Number(page) - 1) * Number(limit);

  const [applications, total] = await Promise.all([
    Application.find(filter)
      .populate('student', 'name email profilePhoto')
      .populate('university', 'name country logo')
      .populate('course', 'name level')
      .populate('counselor', 'name email')
      .skip(skip)
      .limit(Number(limit))
      .sort(sort),
    Application.countDocuments(filter),
  ]);

  res.json(
    new ApiResponse(
      200,
      {
        applications,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / Number(limit)),
      },
      'Applications fetched'
    )
  );
});

export const getAllApplicationsForKanban = asyncHandler(async (req, res) => {
  const filter = buildFilter(req.query, req.user.role, req.user._id);

  const applications = await Application.find(filter)
    .populate('student', 'name email profilePhoto')
    .populate('university', 'name country')
    .populate('course', 'name level')
    .populate('counselor', 'name')
    .sort({ priority: -1, createdAt: -1 })
    .limit(500);

  res.json(new ApiResponse(200, applications, 'Kanban applications fetched'));
});

export const getMyApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find({ student: req.user._id })
    .populate('university', 'name country logo')
    .populate('course', 'name level duration tuitionFee')
    .populate('counselor', 'name email profilePhoto')
    .sort({ createdAt: -1 });

  res.json(new ApiResponse(200, applications, 'My applications fetched'));
});

export const getApplicationById = asyncHandler(async (req, res) => {
  const application = await Application.findById(req.params.id).populate(POPULATE_FIELDS);

  if (!application) throw new ApiError(404, 'Application not found');

  if (
    req.user.role === 'student' &&
    application.student._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'You are not authorized to view this application');
  }

  res.json(new ApiResponse(200, application, 'Application fetched'));
});

export const updateApplication = asyncHandler(async (req, res) => {
  const { university, course, intakeYear, intakeMonth, priority, notes, counselor } = req.body;

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { university, course, intakeYear, intakeMonth, priority, notes, counselor },
    { new: true, runValidators: true }
  ).populate(POPULATE_FIELDS);

  if (!application) throw new ApiError(404, 'Application not found');
  res.json(new ApiResponse(200, application, 'Application updated'));
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { status, note } = req.body;

  if (!APPLICATION_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Invalid status. Must be one of: ${APPLICATION_STATUSES.join(', ')}`
    );
  }

  const application = await Application.findById(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');

  // Counselor can only update their assigned applications
  if (
    req.user.role === 'counselor' &&
    application.counselor?.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(403, 'This application is not assigned to you');
  }

  application.status = status;
  application.statusHistory.push({
    status,
    changedBy: req.user._id,
    note: note?.trim() || '',
    date: new Date(),
  });
  await application.save();

  await application.populate(POPULATE_FIELDS);
  res.json(new ApiResponse(200, application, 'Status updated'));
});

export const assignCounselor = asyncHandler(async (req, res) => {
  const { counselorId } = req.body;
  if (!counselorId) throw new ApiError(400, 'counselorId is required');

  const application = await Application.findByIdAndUpdate(
    req.params.id,
    { counselor: counselorId },
    { new: true }
  ).populate('counselor', 'name email');

  if (!application) throw new ApiError(404, 'Application not found');
  res.json(new ApiResponse(200, application, 'Counselor assigned'));
});

export const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findByIdAndDelete(req.params.id);
  if (!application) throw new ApiError(404, 'Application not found');
  res.json(new ApiResponse(200, {}, 'Application deleted'));
});

export const getApplicationStats = asyncHandler(async (req, res) => {
  const matchFilter = buildFilter(req.query, req.user.role, req.user._id);

  const [byStatus, total, byPriority] = await Promise.all([
    Application.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Application.countDocuments(matchFilter),
    Application.aggregate([
      { $match: matchFilter },
      { $group: { _id: '$priority', count: { $sum: 1 } } },
    ]),
  ]);

  const statusMap = Object.fromEntries(byStatus.map((s) => [s._id, s.count]));
  const priorityMap = Object.fromEntries(byPriority.map((p) => [p._id, p.count]));

  res.json(
    new ApiResponse(
      200,
      {
        total,
        byStatus: Object.fromEntries(
          APPLICATION_STATUSES.map((s) => [s, statusMap[s] || 0])
        ),
        byPriority: {
          low: priorityMap.low || 0,
          medium: priorityMap.medium || 0,
          high: priorityMap.high || 0,
        },
      },
      'Stats fetched'
    )
  );
});
