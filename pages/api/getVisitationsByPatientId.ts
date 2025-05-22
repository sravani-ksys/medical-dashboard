import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { patientId } = req.query;

  if (!patientId || typeof patientId !== 'string') {
    return res.status(400).json({ message: 'Missing or invalid patient ID' });
  }

  try {
    const visitations = await prisma.visitation.findMany({
      where: { patientId },
      orderBy: { visitedAt: 'desc' },
      include: {
        doctor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    res.status(200).json(visitations);
  } catch (error) {
    console.error('Error fetching visitations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
