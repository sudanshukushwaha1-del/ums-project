import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Only ADMIN can access these routes
router.use(authenticate, requireRole(['ADMIN']));

// Get all users
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get all courses
router.get('/courses', async (req, res) => {
  const courses = await prisma.course.findMany();
  res.json(courses);
});

// Create a new course
router.post('/courses', async (req, res) => {
  const { title, code, credits, description } = req.body;
  try {
    const course = await prisma.course.create({
      data: { title, code, credits, description },
    });
    res.json(course);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create course' });
  }
});

export default router;
