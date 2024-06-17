"use client";

import { useState, useEffect } from 'react';
import WorkTimeModal from '../../components/WorkTimeModal';
import React from 'react';

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
    <div className="container mx-auto p-4 bg-secondary min-h-screen text-primary">
      <h1 className="text-2xl font-bold mb-4">Dashboard für Handwerker</h1>
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

      <table className="table-auto w-full mt-4 text-primary">
        <thead>
          <tr>
            <th className="px-4 py-2">Tag</th>
            <th className="px-4 py-2">Von</th>
            <th className="px-4 py-2">Bis</th>
          </tr>
        </thead>
        <tbody>
          {workTimes.map((workTime, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{workTime.day}</td>
              <td className="border px-4 py-2">{workTime.from}</td>
              <td className="border px-4 py-2">{workTime.to}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
