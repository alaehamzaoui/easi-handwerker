'use client';

import { useState, useEffect } from 'react';
import WorkTimeModal from '../../components/WorkTimeModal';
import React from 'react';
import { FaClock, FaUser, FaHome } from 'react-icons/fa';

interface WorkTime {
  day: string;
  from: string;
  to: string;
}

const Dashboard = () => {
  const [workTimes, setWorkTimes] = useState<WorkTime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Funktion zum Laden der gespeicherten Arbeitszeiten
  const fetchWorkTimes = () => {
    fetch('/api/workTimes')
      .then((res) => res.json())
      .then((data) => setWorkTimes(data))
      .catch((err) => console.error('Error fetching work times:', err));
  };

  // Lade gespeicherte Arbeitszeiten beim Initialisieren der Komponente
  useEffect(() => {
    fetchWorkTimes();
  }, []);

  // Aktualisiere die Arbeitszeiten und speichere sie in der JSON-Datei
  const handleUpdateWorkTime = (updatedWorkTimes: WorkTime[]) => {
    fetch('/api/workTimes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedWorkTimes),
    })
      .then((res) => res.json())
      .then(() => fetchWorkTimes()) // Lade die Arbeitszeiten erneut
      .catch((err) => console.error('Error updating work times:', err));
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 text-black">
      <aside className="w-64 bg-yellow-600 text-black flex flex-col p-4">
        <h1 className="text-3xl font-bold mb-8">MiniMeister</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <FaHome className="mr-2" /> Home
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <FaClock className="mr-2" /> Arbeitszeiten
              </a>
            </li>
            <li className="mb-4">
              <a href="#" className="flex items-center">
                <FaUser className="mr-2" /> Profil
              </a>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-yellow-600 text-black p-4">
          <h2 className="text-2xl font-bold">Dashboard für Handwerker</h2>
        </header>

        <main className="flex-grow container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <button
                className="bg-yellow-600 text-black py-2 px-4 rounded hover:bg-yellow-700 mb-4 flex items-center"
                onClick={() => setIsModalOpen(true)}
              >
                <FaClock className="mr-2" /> Zeit pflegen
              </button>

              {isModalOpen && (
                <WorkTimeModal
                  initialWorkTimes={workTimes}
                  onSave={(updatedWorkTimes) => {
                    handleUpdateWorkTime(updatedWorkTimes);
                    setIsModalOpen(false);
                  }}
                  onCancel={() => {
                    setIsModalOpen(false);
                    fetchWorkTimes(); // Lade die Arbeitszeiten erneut
                  }}
                />
              )}

              <table className="table-auto w-full mt-4 bg-white shadow-md rounded text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Tag</th>
                    <th className="px-4 py-2">Von</th>
                    <th className="px-4 py-2">Bis</th>
                  </tr>
                </thead>
                <tbody>
                  {workTimes.map((workTime, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{workTime.day}</td>
                      <td className="px-4 py-2">{workTime.from}</td>
                      <td className="px-4 py-2">{workTime.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="bg-white shadow-md rounded p-4 text-center">
              <img
                className="w-32 h-32 rounded-full mx-auto mb-4"
                src="/path/to/profile-pic.jpg"
                alt="Profile"
              />
              <h2 className="text-xl font-bold text-yellow-600">Ilyas Errarhoute</h2>
              <p className="text-gray-600">Elektriker</p>
              <p className="text-gray-600">Bochum</p>
              <p className="text-gray-600">PLZ: 44787</p>
              <p className="text-gray-600">Adresse: Musterstraße 1</p>
            </div>
          </div>
        </main>

        <footer className="bg-black text-white p-4 text-center">
          <p>Entwickelt von EASI</p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;