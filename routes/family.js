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

// Get all family members
router.get('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const familyMembers = await prisma.familyMember.findMany({
    where: { userId },
    include: { medicalHistory: true, medicalDocuments: true }
  });
  res.json({ familyMembers });
});

// Create family member
router.post('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { name, relationship, age, gender } = req.body;
  const familyMember = await prisma.familyMember.create({
    data: { userId, name, relationship, age, gender }
  });
  res.json({ familyMember });
});

// Update family member
router.put('/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const data = req.body;
  const familyMember = await prisma.familyMember.update({ where: { id }, data });
  res.json({ familyMember });
});

// Delete family member
router.delete('/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  await prisma.familyMember.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
