// pages/PatientRecord.tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

export default function PatientRecord() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState<any>(null);

   useEffect(() => {
    if (id) {
      fetch(`/api/getPatientById?id=${id}`)
        .then(res => res.json())
        .then(data => setPatient(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  return (
    <>
    <Header/>
    <div className="flex h-screen">
      <Sidebar activeTab="patients" />
      <main className="flex-1 p-6 bg-gray-50">
        <button onClick={() => router.push('/home')} className="mb-4 text-blue-600">
          ← Back to Patients
        </button>
        {patient ? (
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {patient.firstName} {patient.lastName}
            </h2>
            <p>DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
            <p>Age: {patient.age}</p>
            <p>Gender: {patient.gender}</p>
            <p>Phone: {patient.phone}</p>
            <p>Email: {patient.email}</p>
          </div>
        ) : (
          <p>Loading patient details...</p>
        )}
      </main>
    </div>
    </>
  );
}
