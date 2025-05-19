import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  age: number;
  gender: string;
  phone: string;
  email: string;
}

export default function Patients() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    age: '',
    gender: '',
    phone: '',
    email: ''
  });

  const fetchPatients = async () => {
    try {
      const response = await fetch('/api/getPatientsInfo');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setShowModal(false);
      }
    };
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showModal]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPatient = async () => {
    try {
      const response = await fetch('/api/addPatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, 
          age: Number(formData.age),
          dateOfBirth: new Date(formData.dateOfBirth).toISOString(), 
        }),
      });
      if (response.ok) {
        setShowModal(false);
        setFormData({ firstName: '', lastName: '', dateOfBirth: '', age: '', gender: '', phone: '', email: '' });
        fetchPatients();
      } else {
        console.error('Failed to add patient');
      }
    } catch (error) {
      console.error('Error adding patient:', error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Patient List</h2>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-full"
        >
          Add Patient
        </button>
      </div>

      {loading ? (
        <p>Loading patients...</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-600">No patients found. Add a new patient to get started.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {patients.map((patient) => (
            <li
              key={patient.id}
              onClick={() => router.push(`/patient/${patient.id}`)} // ✅ Redirect to PatientRecord
              className="p-3 border rounded shadow-sm hover:shadow-md transition cursor-pointer"
            >
              <div className="font-medium">
                {patient.firstName} {patient.lastName}
              </div>
              <div className="text-sm text-gray-600">
                Age: {patient.age}, Gender: {patient.gender}
              </div>
              <div className="text-sm text-gray-600">Contact: {patient.phone}</div>
            </li>
          ))}
        </ul>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Add New Patient</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="number"
                name="age"
                placeholder="Age"
                value={formData.age}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full border px-3 py-2 rounded"
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
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
                onClick={handleAddPatient}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
