// pages/api/patients.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; // Adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        age: true,
        gender: true,
        phone: true,
        email: true,
      },
    });

    res.status(200).json(patients || []);
  } catch (error) {
    console.error('Failed to fetch patients:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
