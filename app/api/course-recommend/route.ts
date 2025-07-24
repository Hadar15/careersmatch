import { NextRequest, NextResponse } from 'next/server';

const dummyCourses = [
  {
    title: 'React for Beginners',
    provider: 'Coursera',
    url: 'https://coursera.org/learn/react',
    duration: '4 weeks',
    level: 'Beginner',
    description: 'Belajar React dari dasar hingga mahir.',
    reason: 'Skill React dibutuhkan untuk job match teratas.'
  },
  {
    title: 'Advanced Node.js',
    provider: 'Udemy',
    url: 'https://udemy.com/course/advanced-nodejs',
    duration: '6 weeks',
    level: 'Advanced',
    description: 'Node.js untuk backend development modern.',
    reason: 'Backend Node.js sering muncul di job match.'
  },
  {
    title: 'Effective Communication',
    provider: 'edX',
    url: 'https://edx.org/course/effective-communication',
    duration: '3 weeks',
    level: 'All Levels',
    description: 'Tingkatkan kemampuan komunikasi profesional.',
    reason: 'Soft skill penting untuk kolaborasi tim.'
  },
  {
    title: 'SQL & Databases',
    provider: 'Coursera',
    url: 'https://coursera.org/learn/sql-databases',
    duration: '5 weeks',
    level: 'Intermediate',
    description: 'Dasar hingga lanjutan SQL dan database.',
    reason: 'SQL dibutuhkan di banyak job IT.'
  },
  {
    title: 'Project Management Basics',
    provider: 'Udemy',
    url: 'https://udemy.com/course/project-management-basics',
    duration: '2 weeks',
    level: 'Beginner',
    description: 'Dasar-dasar manajemen proyek modern.',
    reason: 'Project management sering jadi skill gap.'
  },
  {
    title: 'Python for Everybody',
    provider: 'Coursera',
    url: 'https://coursera.org/learn/python',
    duration: '6 weeks',
    level: 'Beginner',
    description: 'Belajar Python dari nol.',
    reason: 'Python sering dibutuhkan di job teknologi.'
  },
  {
    title: 'Cloud Computing Fundamentals',
    provider: 'edX',
    url: 'https://edx.org/course/cloud-computing',
    duration: '4 weeks',
    level: 'Intermediate',
    description: 'Dasar cloud dan deployment modern.',
    reason: 'Cloud skill gap untuk banyak perusahaan.'
  },
  {
    title: 'Leadership Essentials',
    provider: 'Udemy',
    url: 'https://udemy.com/course/leadership-essentials',
    duration: '3 weeks',
    level: 'All Levels',
    description: 'Skill kepemimpinan untuk profesional.',
    reason: 'Leadership penting untuk naik jabatan.'
  },
  {
    title: 'Agile & Scrum',
    provider: 'Coursera',
    url: 'https://coursera.org/learn/agile-scrum',
    duration: '2 weeks',
    level: 'Beginner',
    description: 'Metode agile dan scrum untuk tim modern.',
    reason: 'Agile banyak digunakan di perusahaan teknologi.'
  },
  {
    title: 'UI/UX Design Fundamentals',
    provider: 'edX',
    url: 'https://edx.org/course/ui-ux-design',
    duration: '4 weeks',
    level: 'Beginner',
    description: 'Dasar desain UI/UX untuk aplikasi modern.',
    reason: 'UI/UX skill gap untuk pengembangan produk.'
  }
];

export async function POST(req: NextRequest) {
  try {
    // Bisa tambahkan logika skill gap di sini jika ingin lebih dinamis
    return NextResponse.json(dummyCourses);
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Server error' }, { status: 500 });
  }
} 