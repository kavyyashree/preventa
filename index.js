import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import authRoutes from './routes/auth.js';
import profileRoutes from './routes/profile.js';
import familyRoutes from './routes/family.js';
import medicalRoutes from './routes/medical.js';
import appointmentsRoutes from './routes/appointments.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Preventa Backend API is running');
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/family', familyRoutes);
app.use('/api/medical', medicalRoutes);
app.use('/api/appointments', appointmentsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
