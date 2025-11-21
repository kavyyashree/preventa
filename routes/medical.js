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

// Get medical conditions for a family member
router.get('/conditions/:memberId', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { memberId } = req.params;
  const conditions = await prisma.medicalCondition.findMany({ where: { familyMemberId: memberId } });
  res.json({ conditions });
});

// Add medical condition
router.post('/conditions/:memberId', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { memberId } = req.params;
  const { condition, diagnosisDate, severity, treatment, notes } = req.body;
  const medicalCondition = await prisma.medicalCondition.create({
    data: { familyMemberId: memberId, condition, diagnosisDate, severity, treatment, notes }
  });
  res.json({ medicalCondition });
});

// Update medical condition
router.put('/conditions/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const data = req.body;
  const medicalCondition = await prisma.medicalCondition.update({ where: { id }, data });
  res.json({ medicalCondition });
});

// Delete medical condition
router.delete('/conditions/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  await prisma.medicalCondition.delete({ where: { id } });
  res.json({ success: true });
});

// Get medical documents for a family member
router.get('/documents/:memberId', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { memberId } = req.params;
  const documents = await prisma.medicalDocument.findMany({ where: { familyMemberId: memberId } });
  res.json({ documents });
});

// Add medical document
router.post('/documents/:memberId', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { memberId } = req.params;
  const { name, type, size, uploadDate } = req.body;
  const medicalDocument = await prisma.medicalDocument.create({
    data: { familyMemberId: memberId, name, type, size, uploadDate }
  });
  res.json({ medicalDocument });
});

// Update medical document
router.put('/documents/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  const data = req.body;
  const medicalDocument = await prisma.medicalDocument.update({ where: { id }, data });
  res.json({ medicalDocument });
});

// Delete medical document
router.delete('/documents/:id', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { id } = req.params;
  await prisma.medicalDocument.delete({ where: { id } });
  res.json({ success: true });
});

export default router;
