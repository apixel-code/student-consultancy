import mongoose from 'mongoose';
import User from '../models/User.js';
import Application, { APPLICATION_STATUSES } from '../models/Application.js';
import Document from '../models/Document.js';
import University from '../models/University.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                     'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Fill in zeros for all 12 months even if aggregation returned no data
const fillMonthlyData = (rawData) => {
  const now = new Date();
  const map = new Map(rawData.map(({ _id, count }) => [`${_id.year}-${_id.month}`, count]));
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    return {
      month: MONTH_SHORT[d.getMonth()],
      year: d.getFullYear(),
      count: map.get(`${d.getFullYear()}-${d.getMonth() + 1}`) || 0,
    };
  });
};

export const getStats = asyncHandler(async (req, res) => {
  const now = new Date();
  const thisMonthStart  = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastMonthStart  = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastMonthEnd    = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
  const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const [
    totalStudents,
    totalCounselors,
    totalApplications,
    pendingDocuments,
    byStatusRaw,
    monthlyRaw,
    topUniversities,
    topCounselors,
    recentApplications,
    // Comparison values for % change cards
    studentsLastMonth,
    applicationsLastMonth,
    applicationsThisMonth,
  ] = await Promise.all([
    User.countDocuments({ role: 'student', isActive: true }),
    User.countDocuments({ role: 'counselor', isActive: true }),
    Application.countDocuments(),
    Document.countDocuments({ status: 'pending', isDeleted: false }),

    // By status
    Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),

    // Last 12 months trend
    Application.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]),

    // Top 5 universities by application volume
    Application.aggregate([
      { $group: { _id: '$university', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'universities',
          localField: '_id',
          foreignField: '_id',
          as: 'uni',
        },
      },
      { $unwind: { path: '$uni', preserveNullAndEmpty: true } },
      {
        $project: {
          name: { $ifNull: ['$uni.name', 'Unknown'] },
          country: { $ifNull: ['$uni.country', ''] },
          count: 1,
        },
      },
    ]),

    // Top 5 counselors with conversion rate (enrolled / total)
    Application.aggregate([
      { $match: { counselor: { $ne: null } } },
      {
        $group: {
          _id: '$counselor',
          totalApps: { $sum: 1 },
          enrolledCount: {
            $sum: { $cond: [{ $eq: ['$status', 'Enrolled'] }, 1, 0] },
          },
        },
      },
      { $sort: { totalApps: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'counselorData',
        },
      },
      { $unwind: { path: '$counselorData', preserveNullAndEmpty: true } },
      {
        $project: {
          name: { $ifNull: ['$counselorData.name', 'Unknown'] },
          email: { $ifNull: ['$counselorData.email', ''] },
          totalApps: 1,
          enrolledCount: 1,
          conversionRate: {
            $round: [
              {
                $multiply: [
                  { $divide: ['$enrolledCount', { $max: ['$totalApps', 1] }] },
                  100,
                ],
              },
              1,
            ],
          },
        },
      },
    ]),

    // Last 10 applications
    Application.find()
      .populate('student', 'name email profilePhoto')
      .populate('university', 'name country')
      .populate('course', 'name level')
      .populate('counselor', 'name')
      .sort({ createdAt: -1 })
      .limit(10),

    // Comparison: new students last month
    User.countDocuments({
      role: 'student',
      isActive: true,
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    }),

    // Comparison: new applications last month
    Application.countDocuments({
      createdAt: { $gte: lastMonthStart, $lte: lastMonthEnd },
    }),

    // Comparison: new applications this month
    Application.countDocuments({ createdAt: { $gte: thisMonthStart } }),
  ]);

  // Build applicationsByStatus map (all statuses, filling 0 for missing)
  const statusMap = Object.fromEntries(byStatusRaw.map(({ _id, count }) => [_id, count]));
  const applicationsByStatus = Object.fromEntries(
    APPLICATION_STATUSES.map((s) => [s, statusMap[s] || 0])
  );

  res.json(
    new ApiResponse(
      200,
      {
        totalStudents,
        totalCounselors,
        totalApplications,
        documentsAwaitingVerification: pendingDocuments,
        applicationsByStatus,
        applicationsByMonth: fillMonthlyData(monthlyRaw),
        topUniversities,
        topCounselors,
        recentApplications,
        comparison: {
          studentsLastMonth,
          applicationsLastMonth,
          applicationsThisMonth,
        },
      },
      'Dashboard stats fetched'
    )
  );
});

export const getActivityLog = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 50);

  const [recentApps, recentDocs, recentUsers] = await Promise.all([
    Application.find()
      .populate('student', 'name')
      .populate('university', 'name')
      .sort({ updatedAt: -1 })
      .limit(15)
      .select('status student university updatedAt createdAt'),

    Document.find({ isDeleted: false })
      .populate('student', 'name')
      .populate('uploadedBy', 'name role')
      .sort({ createdAt: -1 })
      .limit(10)
      .select('documentType title status student uploadedBy createdAt'),

    User.find({ role: { $in: ['student', 'counselor'] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name role createdAt'),
  ]);

  const events = [
    ...recentApps.map((app) => ({
      type: 'application',
      icon: '📋',
      description: `${app.student?.name || 'Unknown student'} → ${app.status} at ${app.university?.name || 'Unknown university'}`,
      timestamp: app.updatedAt,
    })),
    ...recentDocs.map((doc) => ({
      type: 'document',
      icon: '📄',
      description: `${doc.student?.name || 'Unknown'} uploaded ${doc.documentType.replace(/_/g, ' ')} (${doc.status})`,
      timestamp: doc.createdAt,
    })),
    ...recentUsers.map((u) => ({
      type: 'user',
      icon: u.role === 'student' ? '🎓' : '👤',
      description: `New ${u.role} registered: ${u.name}`,
      timestamp: u.createdAt,
    })),
  ];

  events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  res.json(new ApiResponse(200, events.slice(0, limit), 'Activity log fetched'));
});
