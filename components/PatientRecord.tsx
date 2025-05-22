import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
  address?: string;
}

interface Visitation {
  id: string;
  visitedAt: string;
  diagnosis?: string;
  prescription?: string;
  followUpDate?: string;
  notes?: string;
  doctor: {
    firstName: string;
    lastName: string;
  };
}

export default function PatientRecord() {
  const router = useRouter();
  const { id } = router.query;
  const [patient, setPatient] = useState<Patient | null>(null);
  const [visitations, setVisitations] = useState<Visitation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    visitedAt: '',
    diagnosis: '',
    prescription: '',
    followUpDate: '',
    notes: '',
  });
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/getPatientById?id=${id}`)
        .then(res => res.json())
        .then(data => setPatient(data))
        .catch(err => console.error(err));

      fetch(`/api/getVisitationsByPatientId?patientId=${id}`)
        .then(res => res.json())
        .then(data => setVisitations(data))
        .catch(err => console.error(err));
    }
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddVisitation = async () => {
    try {
      const response = await fetch('/api/addVisitation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          visitedAt: new Date(formData.visitedAt).toISOString(),
          followUpDate: formData.followUpDate ? new Date(formData.followUpDate).toISOString() : null,
          patientId: id,
        }),
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ visitedAt: '', diagnosis: '', prescription: '', followUpDate: '', notes: '' });
        const updated = await fetch(`/api/getVisitationsByPatientId?patientId=${id}`);
        setVisitations(await updated.json());
      } else {
        console.error('Failed to add visitation');
      }
    } catch (error) {
      console.error('Error adding visitation:', error);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeTab="patients" />
      <main className="flex-1 p-6 bg-gray-50 overflow-y-auto">
        <button onClick={() => router.push('/patients')} className="mb-4 text-blue-600">
          ← Back to Patients
        </button>

        {patient ? (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-2xl font-bold mb-2">
                {patient.firstName} {patient.lastName}
              </h2>
              <div className="text-gray-700 space-y-1">
                <p><strong>DOB:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}</p>
                <p><strong>Age:</strong> {patient.age}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Phone:</strong> {patient.phone || 'Not available'}</p>
                <p><strong>Email:</strong> {patient.email || 'Not available'}</p>
                <p><strong>Address:</strong> {patient.address || 'Not available'}</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">Visitations</h3>
              <button
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Log Visitation
              </button>
            </div>

            {visitations.length === 0 ? (
              <p className="text-gray-600">No visitation records available.</p>
            ) : (
              <div className="space-y-4">
                {visitations.map((v) => (
                  <div key={v.id} className="bg-white p-4 rounded shadow">
                    <p><strong>Date:</strong> {new Date(v.visitedAt).toLocaleDateString()}</p>
                    <p><strong>Doctor:</strong> {v.doctor.firstName} {v.doctor.lastName}</p>
                    <p><strong>Diagnosis:</strong> {v.diagnosis || 'Not provided'}</p>
                    <p><strong>Prescription:</strong> {v.prescription || 'Not provided'}</p>
                    <p><strong>Notes:</strong> {v.notes || 'Not provided'}</p>
                    <p><strong>Follow-up:</strong> {v.followUpDate ? new Date(v.followUpDate).toLocaleDateString() : 'None'}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p>Loading patient details...</p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Log New Visitation</h3>
              <div className="space-y-3">
                <input
                  type="datetime-local"
                  name="visitedAt"
                  value={formData.visitedAt}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="diagnosis"
                  placeholder="Diagnosis"
                  value={formData.diagnosis}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="prescription"
                  placeholder="Prescription"
                  value={formData.prescription}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <textarea
                    name="notes"
                    placeholder="Notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full border px-3 py-2 rounded resize-none"
                />
                <input
                  type="date"
                  name="followUpDate"
                  value={formData.followUpDate}
                  onChange={handleInputChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end mt-6 space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddVisitation}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
