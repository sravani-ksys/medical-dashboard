// pages/api/addPatient.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma'; // adjust if needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { firstName, lastName, dateOfBirth, age, gender, phone, email } = req.body;
    console.log('bosy', req.body)

    try {
      const newPatient = await prisma.patient.create({
        data: {
          firstName,
          lastName,
          // dateOfBirth,
          dateOfBirth: "1995-08-20T00:00:00.000Z",
          age,
          gender,
          phone,
          email,
        },
      });

      res.status(200).json(newPatient);
    } catch (error) {
      console.error('Error adding patient:', error);
      res.status(500).json({ error: 'Error creating patient' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
