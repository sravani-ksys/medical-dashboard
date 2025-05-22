import React from 'react';
import { useRouter } from 'next/router';

interface SidebarProps {
  activeTab: 'patients' | 'appointments';
}

export default function Sidebar({activeTab} : SidebarProps) {
  const router = useRouter();

  const handleTabClick = (tab: 'patients' | 'appointments') => {
    router.push(`/${tab}`);
  };

  return (
    <aside className="w-28 bg-gray-800 text-white flex flex-col items-center py-4 space-y-4">
      <div className=''>
      <button
        className={`w-24 h-12 flex items-center justify-center rounded-md hover:bg-gray-700 ${
          activeTab === 'patients' ? 'bg-gray-700' : ''
        }`}
        onClick={() => handleTabClick('patients')}
        title="Patients"
      >
        <div className="flex flex-col items-center">
        <span>🧑‍⚕️</span>
        <span>Patients</span>
        </div>
      </button>
      </div>
      <button
        className={`w-24 h-12 flex items-center justify-center rounded-md hover:bg-gray-700 ${
          activeTab === 'appointments' ? 'bg-gray-700' : ''
        }`}
        onClick={() => handleTabClick('appointments')}
        title="Appointments"
      >
        
        <div className="flex flex-col items-center">
        <span>📅</span>
        <span>Visits</span>
        </div>
      </button>
    </aside>
  );
}
