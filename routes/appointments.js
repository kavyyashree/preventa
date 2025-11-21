import express from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

function getUserId(req) {
  const auth = req.headers.authorization;
  if (!auth) return null;
  try {
    const { userId } = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    return userId;
  } catch {
    return null;
  }
}

// Get all appointments for user
router.get('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const appointments = await prisma.appointment.findMany({ where: { userId } });
  res.json({ appointments });
});

// Create appointment
router.post('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { memberId, condition, severity, date, clinic } = req.body;
  const appointment = await prisma.appointment.create({ data: { userId, memberId, condition, severity, date, clinic } });
  res.json({ appointment });
});

// Reschedule appointment
router.put('/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { date } = req.body;
  const { id } = req.params;
  const appointment = await prisma.appointment.update({ where: { id }, data: { date } });
  res.json({ appointment });
});

export default router;
