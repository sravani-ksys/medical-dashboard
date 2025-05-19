// pages/index.tsx or HomePage.tsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import Patients from './Patients';
import Appointments from './Appointments';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'patients' | 'appointments'>('patients');

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 p-6 bg-gray-50">
        {activeTab === 'patients' && <Patients />}
        {activeTab === 'appointments' && <Appointments />}
      </main>
    </div>
  );
}
