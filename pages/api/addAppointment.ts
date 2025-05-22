import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { patientId, doctorId, scheduledAt, reason } = req.body;
    try {
      const appointment = await prisma.appointment.create({
        data: {
          patientId,
          doctorId,
          scheduledAt: new Date(scheduledAt),
          reason,
        },
      });
      res.status(200).json(appointment);
    } catch (err) {
      res.status(500).json({ error: 'Failed to create appointment' });
    }
  }
}
