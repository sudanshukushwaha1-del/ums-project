import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, requireRole, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate, requireRole(['FACULTY']));

// Get assigned courses
router.get('/courses', async (req: AuthRequest, res) => {
  const facultyId = req.userRole; // We need to fetch the actual DB ID, but for now assuming user email is enough to get the ID.
  
  try {
    const dbUser = await prisma.user.findUnique({ where: { email: req.user.email } });
    if (!dbUser) return res.status(404).json({ error: 'User not found' });

    const assignments = await prisma.facultyCourse.findMany({
      where: { facultyId: dbUser.id },
      include: { course: true }
    });
    res.json(assignments.map(a => a.course));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

export default router;
