import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; // Adjust path if different

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  console.log("id", id);

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing ID' });
  }

  try {
    const patient = await prisma.patient.findUnique({ where: { id } });
    if (!patient) return res.status(404).json({ error: 'Patient not found' });
    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}
