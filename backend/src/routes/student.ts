import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requireRole(['STUDENT']));

// Get enrolled courses and grades
router.get('/dashboard', async (req: AuthRequest, res) => {
  try {
    const dbUser = await prisma.user.findUnique({ where: { email: req.user.email } });
    if (!dbUser) return res.status(404).json({ error: 'User not found' });

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId: dbUser.id },
      include: { course: true }
    });

    const grades = await prisma.grade.findMany({
      where: { studentId: dbUser.id },
      include: { course: true }
    });

    res.json({
      courses: enrollments.map(e => e.course),
      grades: grades
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

export default router;
