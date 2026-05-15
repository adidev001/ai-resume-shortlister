import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Candidate from '../models/Candidate.js';

// Load env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '..', '.env') });

/**
 * Sample seed data for testing the application.
 */
const seedCandidates = [
  {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    skills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'TypeScript'],
    experience: 4,
    bio: 'Full-stack developer with 4 years of experience building scalable web applications. Led development of an e-commerce platform serving 50K+ users. Proficient in MERN stack and cloud deployments.',
  },
  {
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    skills: ['Python', 'Django', 'PostgreSQL', 'React', 'Docker'],
    experience: 3,
    bio: 'Backend-focused developer skilled in Python and Django. Built RESTful APIs for fintech applications. Experience with containerized deployments and CI/CD pipelines.',
  },
  {
    name: 'Arjun Verma',
    email: 'arjun.verma@outlook.com',
    skills: ['Java', 'Spring Boot', 'Kubernetes', 'AWS', 'Microservices'],
    experience: 6,
    bio: 'Senior backend engineer specializing in Java microservices architecture. Managed distributed systems at scale. AWS certified solutions architect.',
  },
  {
    name: 'Sneha Reddy',
    email: 'sneha.reddy@yahoo.com',
    skills: ['React', 'Next.js', 'TailwindCSS', 'Node.js', 'GraphQL'],
    experience: 2,
    bio: 'Frontend developer passionate about creating beautiful user interfaces. Experience with Next.js SSR applications and modern CSS frameworks. Built a design system used by 3 product teams.',
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@gmail.com',
    skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'AWS'],
    experience: 5,
    bio: 'Full-stack developer with expertise in the MERN stack. Built real-time chat applications and e-commerce platforms. Experienced with caching strategies and performance optimization.',
  },
  {
    name: 'Ananya Gupta',
    email: 'ananya.gupta@gmail.com',
    skills: ['Angular', 'TypeScript', 'RxJS', 'Node.js', 'Firebase'],
    experience: 3,
    bio: 'Frontend specialist with strong Angular and TypeScript skills. Developed enterprise dashboards and admin panels. Active open-source contributor.',
  },
  {
    name: 'Karthik Iyer',
    email: 'karthik.iyer@hotmail.com',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'React', 'FastAPI'],
    experience: 4,
    bio: 'ML engineer with full-stack capabilities. Built recommendation systems and NLP pipelines. Experience deploying ML models with FastAPI and React frontends.',
  },
  {
    name: 'Meera Joshi',
    email: 'meera.joshi@gmail.com',
    skills: ['Vue.js', 'Node.js', 'PostgreSQL', 'Docker', 'CI/CD'],
    experience: 2,
    bio: 'Versatile developer comfortable with both frontend and backend. Built internal tools and automation dashboards. Strong focus on testing and code quality.',
  },
  {
    name: 'Rohan Deshmukh',
    email: 'rohan.d@gmail.com',
    skills: ['React', 'Node.js', 'MongoDB', 'Express', 'Socket.io'],
    experience: 1,
    bio: 'Junior full-stack developer with MERN stack experience. Built a real-time collaboration tool as a capstone project. Eager learner with strong problem-solving skills.',
  },
  {
    name: 'Divya Nair',
    email: 'divya.nair@gmail.com',
    skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL', 'GraphQL'],
    experience: 7,
    bio: 'Tech lead with 7 years of experience. Led teams of 8+ developers. Expert in system design, code reviews, and mentoring. Built healthcare and logistics platforms.',
  },
];

/**
 * Seed the database with sample candidates.
 */
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB connected for seeding');

    // Clear existing candidates
    await Candidate.deleteMany({});
    console.log('🗑️  Cleared existing candidates');

    // Insert seed data
    const inserted = await Candidate.insertMany(seedCandidates);
    console.log(`🌱 Seeded ${inserted.length} candidates successfully`);

    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error.message);
    process.exit(1);
  }
};

seedDB();
