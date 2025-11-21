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

// Get profile
router.get('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const user = await prisma.user.findUnique({ where: { id: userId } });
  res.json({ user });
});

// Update profile
router.put('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const data = req.body;
  const user = await prisma.user.update({ where: { id: userId }, data });
  res.json({ user });
});

export default router;
