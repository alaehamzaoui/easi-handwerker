"use client";

import { useState, useEffect } from 'react';
import WorkTimeModal from '../../components/WorkTimeModal';
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
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const logout = () => {
    sessionStorage.removeItem('user');
    window.location.href = '/login';
  };

  const fetchWorkTimes = (email: string) => {
    fetch(`/api/workTimes?email=${email}`)
      .then((res) => res.json())
      .then((data) => setWorkTimes(data))
      .catch((err) => console.error('Error fetching work times:', err));
  };

  useEffect(() => {
    const userDataString = sessionStorage.getItem('user');
    if (!userDataString) {
      window.location.href = '/login';
    } else {
      const userData = JSON.parse(userDataString);
      setUserData(userData);
      fetchWorkTimes(userData.email);
      setIsLoading(false);
    }
  }, []);

  const handleUpdateWorkTime = (updatedWorkTimes: WorkTime[]) => {
    fetch('/api/workTimes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: userData.email, workTimes: updatedWorkTimes }),
    })
      .then((res) => res.json())
      .then(() => fetchWorkTimes(userData.email))
      .catch((err) => console.error('Fehler beim Aktualisieren der Arbeitszeiten:', err));
  };

  if (isLoading) {
    return null;
  }

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
            <span className="text-2xl font-bold">{`Willkommen, ${userData.firstName}`}</span>
          )}
          <div className="flex items-center">
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 bg-yellow-500 white rounded hover:bg-yellow-400 transition"
            >
              Logout
            </button>
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
                className={`${isDarkMode ? 'bg-gray-800 text-yellow-500' : 'bg-yellow-600 text-black'} py-2 px-4 rounded hover:bg-yellow-700 mb-4 flex items-center`}
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
                    fetchWorkTimes(userData.email);
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
                <h2 className={`${isDarkMode ? 'text-yellow-500' : 'text-yellow-600'} text-xl font-bold`}>{`${userData.firstName} ${userData.lastName}`}</h2>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userData.category}</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userData.city}</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userData.street}</p>
                <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{userData.phone}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
