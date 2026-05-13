/**
 * Seed script — run once to populate the database with demo data.
 *
 * Usage:
 *   node seed.js          → seed (skips if admin already exists)
 *   node seed.js --fresh  → wipe ALL collections first, then seed
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import University from './models/University.js';
import Course from './models/Course.js';
import Application from './models/Application.js';
import Document from './models/Document.js';
import SuccessStory from './models/SuccessStory.js';

const FRESH = process.argv.includes('--fresh');

// ─── Helpers ──────────────────────────────────────────────────────────────────

const log = (msg) => console.log(`  ✔  ${msg}`);
const err = (msg) => console.error(`  ✘  ${msg}`);

const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// Build N dates spread over the last 12 months
const pastDate = (daysAgo) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d;
};

// ─── Raw data ─────────────────────────────────────────────────────────────────

const UNIVERSITIES = [
  { name: 'University of Toronto', country: 'Canada', city: 'Toronto', ranking: 18, website: 'https://utoronto.ca' },
  { name: 'University of Melbourne', country: 'Australia', city: 'Melbourne', ranking: 33, website: 'https://unimelb.edu.au' },
  { name: 'University of Edinburgh', country: 'UK', city: 'Edinburgh', ranking: 22, website: 'https://ed.ac.uk' },
  { name: 'TU Munich', country: 'Germany', city: 'Munich', ranking: 37, website: 'https://tum.de' },
  { name: 'University of Auckland', country: 'New Zealand', city: 'Auckland', ranking: 87, website: 'https://auckland.ac.nz' },
  { name: 'McGill University', country: 'Canada', city: 'Montreal', ranking: 46, website: 'https://mcgill.ca' },
  { name: 'University of Sydney', country: 'Australia', city: 'Sydney', ranking: 41, website: 'https://sydney.edu.au' },
  { name: 'Delft University of Technology', country: 'Netherlands', city: 'Delft', ranking: 57, website: 'https://tudelft.nl' },
];

const COURSES_PER_UNI = [
  [
    { name: 'Computer Science', level: 'Bachelor', duration: '4 years', tuitionFee: { amount: 32000, currency: 'CAD' }, requirements: { ielts: 6.5, gpa: 3.0 }, intakes: [9] },
    { name: 'Data Science', level: 'Master', duration: '2 years', tuitionFee: { amount: 38000, currency: 'CAD' }, requirements: { ielts: 7.0, gpa: 3.3 }, intakes: [9, 1] },
    { name: 'MBA', level: 'Master', duration: '2 years', tuitionFee: { amount: 45000, currency: 'CAD' }, requirements: { ielts: 7.0, gpa: 3.5 }, intakes: [9] },
  ],
  [
    { name: 'Engineering (Software)', level: 'Bachelor', duration: '4 years', tuitionFee: { amount: 42000, currency: 'AUD' }, requirements: { ielts: 6.5, gpa: 3.0 }, intakes: [2, 7] },
    { name: 'Artificial Intelligence', level: 'Master', duration: '2 years', tuitionFee: { amount: 48000, currency: 'AUD' }, requirements: { ielts: 7.0, gpa: 3.3 }, intakes: [2, 7] },
  ],
  [
    { name: 'Business Administration', level: 'Bachelor', duration: '4 years', tuitionFee: { amount: 22000, currency: 'GBP' }, requirements: { ielts: 6.5, gpa: 3.0 }, intakes: [9] },
    { name: 'Public Health', level: 'Master', duration: '1 year', tuitionFee: { amount: 28000, currency: 'GBP' }, requirements: { ielts: 7.0, gpa: 3.3 }, intakes: [9] },
  ],
  [
    { name: 'Mechanical Engineering', level: 'Bachelor', duration: '4 years', tuitionFee: { amount: 15000, currency: 'EUR' }, requirements: { ielts: 6.0, gpa: 3.0 }, intakes: [10] },
    { name: 'Robotics & Automation', level: 'Master', duration: '2 years', tuitionFee: { amount: 18000, currency: 'EUR' }, requirements: { ielts: 6.5, gpa: 3.3 }, intakes: [10, 4] },
  ],
  [
    { name: 'Environmental Science', level: 'Bachelor', duration: '3 years', tuitionFee: { amount: 34000, currency: 'NZD' }, requirements: { ielts: 6.0, gpa: 2.8 }, intakes: [2, 7] },
    { name: 'Marine Biology', level: 'Master', duration: '2 years', tuitionFee: { amount: 38000, currency: 'NZD' }, requirements: { ielts: 6.5, gpa: 3.0 }, intakes: [2] },
  ],
  [
    { name: 'Law', level: 'Bachelor', duration: '3 years', tuitionFee: { amount: 36000, currency: 'CAD' }, requirements: { ielts: 7.0, gpa: 3.5 }, intakes: [9] },
    { name: 'Finance', level: 'Master', duration: '1 year', tuitionFee: { amount: 42000, currency: 'CAD' }, requirements: { ielts: 7.0, gpa: 3.3 }, intakes: [9, 1] },
  ],
  [
    { name: 'Architecture', level: 'Bachelor', duration: '5 years', tuitionFee: { amount: 44000, currency: 'AUD' }, requirements: { ielts: 6.5, gpa: 3.0 }, intakes: [2] },
    { name: 'Urban Planning', level: 'Master', duration: '2 years', tuitionFee: { amount: 46000, currency: 'AUD' }, requirements: { ielts: 7.0, gpa: 3.3 }, intakes: [2, 7] },
  ],
  [
    { name: 'Aerospace Engineering', level: 'Bachelor', duration: '4 years', tuitionFee: { amount: 16000, currency: 'EUR' }, requirements: { ielts: 6.5, gpa: 3.0 }, intakes: [9] },
    { name: 'Sustainable Energy', level: 'Master', duration: '2 years', tuitionFee: { amount: 20000, currency: 'EUR' }, requirements: { ielts: 7.0, gpa: 3.3 }, intakes: [9] },
  ],
];

const STUDENT_DATA = [
  { name: 'Rahim Chowdhury',  email: 'rahim@student.com',   phone: '+8801711111111' },
  { name: 'Priya Sharma',     email: 'priya@student.com',   phone: '+8801722222222' },
  { name: 'Ali Hassan',       email: 'ali@student.com',     phone: '+8801733333333' },
  { name: 'Sara Begum',       email: 'sara@student.com',    phone: '+8801744444444' },
  { name: 'Karim Islam',      email: 'karim@student.com',   phone: '+8801755555555' },
  { name: 'Nusrat Jahan',     email: 'nusrat@student.com',  phone: '+8801766666666' },
  { name: 'Farhan Ahmed',     email: 'farhan@student.com',  phone: '+8801777777777' },
  { name: 'Tania Akter',      email: 'tania@student.com',   phone: '+8801788888888' },
  { name: 'Sabbir Rahman',    email: 'sabbir@student.com',  phone: '+8801799999999' },
  { name: 'Mitu Islam',       email: 'mitu@student.com',    phone: '+8801700000000' },
];

const SUCCESS_STORIES = [
  {
    title: "From Dhaka to London: How I Got Into King's College",
    student: 'Md. Raihan Islam',
    program: "MSc Data Science, King's College London",
    country: 'United Kingdom',
    year: '2024',
    ytId: 'dQw4w9WgXcQ',
    initials: 'MR',
    isActive: true,
  },
  {
    title: 'My Canadian University Journey — Full Process Explained',
    student: 'Nadia Rahman',
    program: 'MBA, University of Toronto',
    country: 'Canada',
    year: '2024',
    ytId: 'ScMzIvxBSi4',
    initials: 'NR',
    isActive: true,
  },
  {
    title: 'Free Education in Germany: My TU Munich Story',
    student: 'Ariful Haque',
    program: 'MSc Mechanical Engineering, TU Munich',
    country: 'Germany',
    year: '2023',
    ytId: 'jNQXAC9IVRw',
    initials: 'AH',
    isActive: true,
  },
  {
    title: 'Australia Scholarship & Student Visa — Everything I Did',
    student: 'Sabrina Akter',
    program: 'BSc Computer Science, University of Melbourne',
    country: 'Australia',
    year: '2024',
    ytId: 'M7lc1UVf-VE',
    initials: 'SA',
    isActive: true,
  },
  {
    title: 'How I Got into University of Toronto with Scholarship',
    student: 'Tanvir Ahmed',
    program: 'MEng Software Engineering, University of Waterloo',
    country: 'Canada',
    year: '2023',
    ytId: 'kJQP7kiw5Fk',
    initials: 'TA',
    isActive: false,
  },
  {
    title: 'USA Student Visa F1 — My Complete Experience',
    student: 'Farida Begum',
    program: 'MS Computer Science, Northeastern University',
    country: 'USA',
    year: '2023',
    ytId: 'OPf0YbXqDm0',
    initials: 'FB',
    isActive: true,
  },
];

const STATUSES = [
  'Inquiry', 'Applied', 'Document Submitted',
  'Offer Received', 'Visa Applied', 'Visa Approved',
  'Enrolled', 'Rejected',
];

const STATUS_NOTES = {
  'Inquiry':            'Initial inquiry received.',
  'Applied':            'Application submitted to university.',
  'Document Submitted': 'All required documents uploaded.',
  'Offer Received':     'Conditional offer letter received!',
  'Visa Applied':       'Student visa application submitted.',
  'Visa Approved':      'Visa approved. Ready to travel.',
  'Enrolled':           'Successfully enrolled. Journey begins!',
  'Rejected':           'Application not successful this intake.',
};

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  console.log('\n🌱  Student Consultancy — Seed Script\n');

  await mongoose.connect(process.env.MONGO_URI);
  log('Connected to MongoDB');

  // ── Optionally wipe everything ────────────────────────────────────────────
  if (FRESH) {
    await Promise.all([
      User.deleteMany({}),
      University.deleteMany({}),
      Course.deleteMany({}),
      Application.deleteMany({}),
      Document.deleteMany({}),
      SuccessStory.deleteMany({}),
    ]);
    log('Wiped all collections (--fresh mode)');
  } else {
    const existingAdmin = await User.findOne({ email: 'admin@example.com' });
    if (existingAdmin) {
      console.log('\n⚠️  Admin already exists. Run with --fresh to re-seed.\n');
      await mongoose.disconnect();
      return;
    }
  }

  // ── 1. Create Users ───────────────────────────────────────────────────────
  console.log('\n👤  Creating users…');

  const admin = await User.create({
    name: 'Super Admin',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin',
    phone: '+8801600000001',
  });
  log(`Admin: ${admin.email} / Admin123!`);

  const counselors = await User.insertMany([
    { name: 'David Khan',   email: 'counselor@example.com',  password: await hashPw('Counselor123!'), role: 'counselor', phone: '+8801600000002' },
    { name: 'Sarah Malik',  email: 'sarah@counselor.com',    password: await hashPw('Counselor123!'), role: 'counselor', phone: '+8801600000003' },
  ]);
  log(`Counselors created (${counselors.length})`);

  // Students created one by one so pre-save hook fires for hashing
  const students = [];
  for (const s of STUDENT_DATA) {
    const student = await User.create({ ...s, password: 'Student123!', role: 'student' });
    students.push(student);
  }
  log(`Students created (${students.length})`);

  // ── 2. Universities ───────────────────────────────────────────────────────
  console.log('\n🏛️   Creating universities…');
  const unis = await University.insertMany(UNIVERSITIES);
  log(`Universities created (${unis.length})`);

  // ── 3. Courses ────────────────────────────────────────────────────────────
  console.log('\n📚  Creating courses…');
  const allCourses = [];
  for (let i = 0; i < unis.length; i++) {
    const courseDefs = COURSES_PER_UNI[i] || [];
    for (const def of courseDefs) {
      const course = await Course.create({ ...def, university: unis[i]._id });
      allCourses.push(course);
    }
  }
  log(`Courses created (${allCourses.length})`);

  // ── 4. Applications ───────────────────────────────────────────────────────
  console.log('\n📋  Creating applications…');

  const apps = [];

  // Spread 10 students across counselors and universities
  const statusProgression = [
    'Enrolled',            // student[0] — full journey success
    'Visa Approved',       // student[1]
    'Visa Applied',        // student[2]
    'Offer Received',      // student[3]
    'Document Submitted',  // student[4]
    'Applied',             // student[5]
    'Inquiry',             // student[6]
    'Rejected',            // student[7] — rejected
    'Enrolled',            // student[8] — another success
    'Applied',             // student[9]
  ];

  for (let i = 0; i < students.length; i++) {
    const student = students[i];
    const counselor = counselors[i % counselors.length];
    const uni = unis[i % unis.length];
    const uniCourses = allCourses.filter((c) => c.university.toString() === uni._id.toString());
    const course = uniCourses[0] || allCourses[0];
    const finalStatus = statusProgression[i];

    // Build history up to finalStatus
    const statusIdx = STATUSES.indexOf(finalStatus);
    const history = [];
    for (let j = 0; j <= statusIdx; j++) {
      history.push({
        status: STATUSES[j],
        changedBy: j === 0 ? counselor._id : admin._id,
        note: STATUS_NOTES[STATUSES[j]],
        date: pastDate((statusIdx - j) * 7 + randInt(1, 5)),
      });
    }

    const app = await Application.create({
      student: student._id,
      counselor: counselor._id,
      university: uni._id,
      course: course._id,
      status: finalStatus,
      intakeYear: 2025 + (i % 2),
      intakeMonth: pick([1, 2, 7, 9, 10]),
      priority: pick(['low', 'medium', 'high']),
      notes: `Application for ${student.name}. Processed by ${counselor.name}.`,
      statusHistory: history,
    });
    apps.push(app);
  }

  // Extra applications to show variety in the pipeline
  for (let i = 0; i < 5; i++) {
    const student = pick(students);
    const counselor = pick(counselors);
    const course = pick(allCourses);
    const uni = course.university;
    const status = pick(STATUSES.slice(0, 5));
    const statusIdx = STATUSES.indexOf(status);

    const history = STATUSES.slice(0, statusIdx + 1).map((s, j) => ({
      status: s,
      changedBy: counselor._id,
      note: STATUS_NOTES[s],
      date: pastDate((statusIdx - j) * 5 + randInt(1, 3)),
    }));

    await Application.create({
      student: student._id,
      counselor: counselor._id,
      university: uni,
      course: course._id,
      status,
      intakeYear: 2026,
      intakeMonth: pick([1, 9]),
      priority: pick(['medium', 'high']),
      notes: `Additional application #${i + 1}.`,
      statusHistory: history,
    });
  }

  log(`Applications created (${apps.length + 5})`);

  // ── 5. Documents (metadata only — no real files) ──────────────────────────
  console.log('\n📄  Creating document records…');

  const docTypes = ['passport', 'transcript', 'english_test', 'bank_statement'];

  for (const student of students.slice(0, 6)) {
    const app = apps.find((a) => a.student.toString() === student._id.toString());
    for (const type of docTypes.slice(0, randInt(1, docTypes.length))) {
      await Document.create({
        student: student._id,
        application: app?._id || null,
        documentType: type,
        title: `${student.name} — ${type.replace(/_/g, ' ')}`,
        fileUrl: 'https://res.cloudinary.com/demo/image/upload/sample.pdf',
        cloudinaryPublicId: `seed/${student._id}/${type}/sample`,
        mimeType: 'application/pdf',
        fileSize: randInt(100000, 2000000),
        uploadedBy: student._id,
        status: pick(['pending', 'verified', 'pending']),
        expiryDate: type === 'passport' ? new Date('2028-12-31') : type === 'english_test' ? new Date('2026-11-15') : null,
      });
    }
  }
  log('Document records created');

  // ── 6. Success Stories ────────────────────────────────────────────────────
  console.log('\n🎬  Creating success stories…');
  await SuccessStory.insertMany(
    SUCCESS_STORIES.map(s => ({ ...s, createdBy: admin._id }))
  );
  log(`Success stories created (${SUCCESS_STORIES.length})`);

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log('\n─────────────────────────────────────────');
  console.log('✅  Seed complete!\n');
  console.log('  Login credentials:');
  console.log('  ┌─────────────────────────────────────────┐');
  console.log('  │  Admin      admin@example.com            │');
  console.log('  │             Password: Admin123!           │');
  console.log('  │                                           │');
  console.log('  │  Counselor  counselor@example.com         │');
  console.log('  │             Password: Counselor123!       │');
  console.log('  │                                           │');
  console.log('  │  Student    rahim@student.com             │');
  console.log('  │             Password: Student123!         │');
  console.log('  └─────────────────────────────────────────┘\n');

  await mongoose.disconnect();
}

// bcrypt helper (used for bulk insertMany where pre-save hooks don't fire)
async function hashPw(plain) {
  const bcrypt = await import('bcryptjs');
  return bcrypt.default.hash(plain, 12);
}

seed().catch((e) => {
  err(e.message);
  console.error(e);
  mongoose.disconnect();
  process.exit(1);
});
