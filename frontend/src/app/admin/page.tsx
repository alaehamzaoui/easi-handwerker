"use client";

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSignOutAlt, FaLifeRing } from 'react-icons/fa';
import Image from 'next/image';

interface BenutzerDaten {
  vorname: string;
  nachname: string;
  email: string;
  passwort: string;
  kategorie: string;
  stadt: string;
  straße: string;
  telefon: string;
  stundenlohn: string;
  bild: string;
  id: string;
  verified: boolean;
}

const Admin = () => {
  const [handwerkers, setHandwerkers] = useState<BenutzerDaten[]>([]);
  const [isadmin, setAdmin] = useState<BenutzerDaten | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedHandwerker, setSelectedHandwerker] = useState<BenutzerDaten | null>(null);

  useEffect(() => {
    const isadmin = sessionStorage.getItem('isadmin');
    if (!isadmin) {
      window.location.href = '/login';
    } else {
      const admin = JSON.parse(isadmin);
      setAdmin(admin);
    }
  }, []);

  useEffect(() => {
    fetchHandwerkers();
  }, []);

  const fetchHandwerkers = () => {
    fetch('http://localhost:8080/searchHandwerker')
      .then((response) => response.json())
      .then((data) => {
        setHandwerkers(data);
      })
      .catch((error) => console.error('Error fetching handwerkers:', error));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isadmin');
    window.location.href = '/login';
  };

  const handleIconClick = (handwerker: BenutzerDaten) => {
    setSelectedHandwerker(handwerker);
    setShowModal(true);
  };

  const handleConfirm = () => {
    if (selectedHandwerker) {
      const apiUrl = selectedHandwerker.verified
        ? `http://localhost:8080/handwerker/notverify/${selectedHandwerker.id}`
        : `http://localhost:8080/handwerker/verify/${selectedHandwerker.id}`;

      fetch(apiUrl, {
        method: 'POST',
      })
        .then((response) => {
          if (response.ok) {
            setHandwerkers((prevHandwerkers) =>
              prevHandwerkers.map((handwerker) =>
                handwerker.id === selectedHandwerker.id
                  ? { ...handwerker, verified: !handwerker.verified }
                  : handwerker
              )
            );
          } else {
            console.error('Error updating verification status:', response.statusText);
          }
        })
        .catch((error) => console.error('Error making verification request:', error));
    }

    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 text-black">
      <aside className="bg-yellow-600 w-64 flex flex-col p-6">
        <h1 className="text-4xl font-bold mb-10">MiniMeister</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <button className="flex items-center text-lg font-semibold hover:text-white transition-colors">
                <FaLifeRing className="mr-2" /> Support
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-yellow-600 p-6 flex justify-between items-center">
          {isadmin && (
            <span className="text-2xl font-bold">{`${isadmin.email}`}</span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 flex items-center transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Ausloggen
          </button>
        </header>

        <main className="flex-grow container mx-auto p-6">
          <h2 className="text-2xl font-bold mt-8 mb-4">Handwerker Liste</h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
              <table className="bg-white table-auto w-full shadow-md rounded text-center mb-8">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Vorname</th>
                    <th className="px-4 py-2">Nachname</th>
                    <th className="px-4 py-2">Kategorie</th>
                    <th className="px-4 py-2">Verifiziert</th>
                  </tr>
                </thead>
                <tbody>
                  {handwerkers.length > 0 ? (
                    handwerkers.map((handwerker) => (
                      <tr key={handwerker.id} className="border-t">
                        <td className="px-4 py-2">{handwerker.vorname}</td>
                        <td className="px-4 py-2">{handwerker.nachname}</td>
                        <td className="px-4 py-2">{handwerker.kategorie}</td>
                        <td className="px-4 py-2 flex justify-center items-center">
                          {handwerker.verified ? (
                            <FaCheckCircle className="text-green-500 text-2xl cursor-pointer" onClick={() => handleIconClick(handwerker)} />
                          ) : (
                            <FaTimesCircle className="text-red-500 text-2xl cursor-pointer" onClick={() => handleIconClick(handwerker)} />
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-2">Keine Handwerker gefunden.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <p>Möchten Sie den Handwerker verifizieren?</p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={handleConfirm}
                className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
              >
                Ja
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Nein
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
