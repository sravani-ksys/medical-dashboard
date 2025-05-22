import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Sidebar from './Sidebar';
import { useActiveTab } from '../utils/getActiveTab';

interface Appointment {
  id: string;
  scheduledAt: string;
  status: string;
  reason: string;
  patient: { firstName: string; lastName: string };
  doctor: { firstName: string; lastName: string };
}

interface SelectOption {
  id: string;
  name: string;
}

export default function Appointments() {
  const activeTab = useActiveTab();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    scheduledAt: '',
    reason: '',
  });

  const [patients, setPatients] = useState<SelectOption[]>([]);
  const [doctors, setDoctors] = useState<SelectOption[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    const res = await fetch('/api/getAppointments');
    const data = await res.json();
    setAppointments(data);
  };

  const fetchPatients = async () => {
    const res = await fetch('/api/getPatientsInfo');
    const data = await res.json();
    setPatients(data.map((p: any) => ({
      id: p.id,
      name: `${p.firstName} ${p.lastName}`,
    })));
  };

  const fetchDoctors = async () => {
    const res = await fetch('/api/getDoctors');
    const data = await res.json();
    setDoctors(data.map((d: any) => ({
      id: d.id,
      name: `${d.firstName} ${d.lastName}`,
    })));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async () => {
    const res = await fetch('/api/addAppointment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        scheduledAt: new Date(formData.scheduledAt).toISOString(),
      }),
    });

    if (res.ok) {
      setShowModal(false);
      setFormData({ patientId: '', doctorId: '', scheduledAt: '', reason: '' });
      fetchAppointments();
    } else {
      console.error('Failed to add appointment');
    }
  };

  // Modal close on outside click
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

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} />
      <main className="flex-1 p-6 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Appointments</h2>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Appointment
          </button>
        </div>

        {appointments.length === 0 ? (
          <p>No appointments available.</p>
        ) : (
          <div className="overflow-auto">
            <table className="min-w-full border">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 border">Patient</th>
                  <th className="px-4 py-2 border">Doctor</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Status</th>
                  <th className="px-4 py-2 border">Reason</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr key={appt.id} className="border-t">
                    <td className="px-4 py-2 border">{appt.patient?.firstName} {appt.patient?.lastName}</td>
                    <td className="px-4 py-2 border">{appt.doctor?.firstName} {appt.doctor?.lastName}</td>
                    <td className="px-4 py-2 border">{new Date(appt.scheduledAt).toLocaleString()}</td>
                    <td className="px-4 py-2 border">{appt.status}</td>
                    <td className="px-4 py-2 border">{appt.reason || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div ref={modalRef} className="bg-white p-6 rounded-lg w-full max-w-md shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Add New Appointment</h3>
              <div className="space-y-3">
                <select
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Patient</option>
                  {patients.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Doctor</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
                <input
                  type="datetime-local"
                  name="scheduledAt"
                  value={formData.scheduledAt}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
                <input
                  type="text"
                  name="reason"
                  placeholder="Reason"
                  value={formData.reason}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAppointment}
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
