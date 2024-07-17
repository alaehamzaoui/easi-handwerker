"use client";

import { useState, useEffect } from 'react';
import WorkTimeModal from '../../components/WorkTimeModal';
import React from 'react';
import Link from 'next/link';
import { FaClock, FaUser, FaHome } from 'react-icons/fa';

interface WorkTime {
  day: string;
  from: string;
  to: string;
}

const Dashboard = () => {
  const [workTimes, setWorkTimes] = useState<WorkTime[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };
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
    <div className={`${isDarkMode ? 'bg-black text-yellow-500' : 'bg-gray-100 text-black'} min-h-screen flex flex-row`}>
    <aside className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-yellow-600 text-black'} w-64 flex flex-col p-4`}>
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
      <header className={`${isDarkMode ? 'bg-gray-800 text-white' : 'bg-yellow-600 text-black'} p-4 flex justify-between items-center`}>
        {userData && (
          <span className="text-2xl font-bold">{`Willkommen firstName}`}</span>
        )}
        <div className="flex items-center">
        <Link href="/login">
          <button
            //onClick={logout}
            className="ml-4 px-4 py-2 bg-yellow-500 white rounded hover:bg-yellow-400 transition"
          >
            Logout
          </button>
          </Link>
          <button
            onClick={toggleTheme}
            className="ml-4 px-4 py-2 bg-yellow-500 white rounded hover:bg-yellow-400 transition"
          >
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
      <button
        className="bg-primary text-secondary py-2 px-4 rounded hover:bg-yellow-600"
        onClick={() => setIsModalOpen(true)}
      >
        Zeit pflegen
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

<table className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} table-auto w-full mt-4 shadow-md rounded text-center`}>
                <thead className={`${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <tr>
                    <th className="px-4 py-2">Tag</th>
                    <th className="px-4 py-2">Von</th>
                    <th className="px-4 py-2">Bis</th>
                  </tr>
                </thead>
                <tbody>
                  {workTimes.map((workTime, index) => (
                    <tr key={index} className={`${isDarkMode ? 'border-t border-gray-700' : 'border-t'}`}>
                      <td className="px-4 py-2">{workTime.day}</td>
                      <td className="px-4 py-2">{workTime.from}</td>
                      <td className="px-4 py-2">{workTime.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {userData && (
              <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-md rounded p-4 text-center`}>
                <img
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                  src="/path/to/profile-pic.jpg"
                  alt="Persönliche Daten"
                />
                <h2 className={`${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'} text-xl font-bold`}>{`test`}</h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>profession</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>stadt</p>
              </div>
            )}
          </div>
        </main>

      
      </div>
    </div>
  );
};

export default Dashboard;