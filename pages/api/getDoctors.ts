import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; // Adjust path if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const doctors = await prisma.doctor.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    res.status(200).json(doctors || []);
  } catch (error) {
    console.error('Failed to fetch doctors:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
