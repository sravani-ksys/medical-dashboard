import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { visitedAt, diagnosis, prescription, followUpDate, patientId, notes } = req.body;

  if (!visitedAt || !patientId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const newVisitation = await prisma.visitation.create({
      data: {
        visitedAt: new Date(visitedAt),
        diagnosis,
        prescription,
        followUpDate: followUpDate ? new Date(followUpDate) : null,
        doctorId: "4a26cb60-6767-4a5d-836e-6ccaf20135a8",
        patientId,
        notes
      },
    });

    res.status(201).json(newVisitation);
  } catch (error) {
    console.error('Error adding visitation:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
