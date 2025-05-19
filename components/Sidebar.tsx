import React from 'react';
import { useRouter } from 'next/router';

interface SidebarProps {
  activeTab: 'patients' | 'appointments';
  setActiveTab?: (tab: 'patients' | 'appointments') => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();

  const handleTabClick = (tab: 'patients' | 'appointments') => {
    setActiveTab?.(tab);
    router.push('/');
  };

  return (
    <aside className="w-16 bg-gray-800 text-white flex flex-col items-center py-4 space-y-4">
      <button
        className={`w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-700 ${
          activeTab === 'patients' ? 'bg-gray-700' : ''
        }`}
        onClick={() => handleTabClick('patients')}
        title="Patients"
      >
        🧑‍⚕️
      </button>
      <button
        className={`w-12 h-12 flex items-center justify-center rounded-md hover:bg-gray-700 ${
          activeTab === 'appointments' ? 'bg-gray-700' : ''
        }`}
        onClick={() => handleTabClick('appointments')}
        title="Appointments"
      >
        📅
      </button>
    </aside>
  );
}
