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
  vertrag: string;
}

const Admin = () => {
  const [handwerkers, setHandwerkers] = useState<BenutzerDaten[]>([]);
  const [isadmin, setAdmin] = useState<BenutzerDaten | null>(null);
  const [showPDF, setShowPDF] = useState(false);
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

  const handlePDFClick = (handwerker: BenutzerDaten) => {
    setSelectedHandwerker(handwerker);
    setShowPDF(true);
  };

  const handleVerify = () => {
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
            setShowPDF(false);
          } else {
            console.error('Error updating verification status:', response.statusText);
          }
        })
        .catch((error) => console.error('Error making verification request:', error));
    }
  };

  const handleCloseModal = (e: any) => {
    if (e.target.classList.contains("modal-overlay")) {
      setShowPDF(false);
    }
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
                    <th className="px-4 py-2">Vertrag</th>
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
                            <FaCheckCircle className="text-green-500 text-2xl" />
                          ) : (
                            <FaTimesCircle className="text-red-500 text-2xl" />
                          )}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handlePDFClick(handwerker)}
                            className="text-blue-500 underline"
                          >
                            Vertrag anzeigen
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-2">Keine Handwerker gefunden.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {showPDF && selectedHandwerker?.vertrag && (
        <div
          className="modal-overlay fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 "
          onClick={handleCloseModal}
        >
          <div className="bg-white p-6 rounded shadow-lg text-center relative  pt-10 mt-10">
            <button
              onClick={() => setShowPDF(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700 transition"
            >
              ✕
            </button>
            <iframe
              src={`data:application/pdf;base64,${selectedHandwerker.vertrag}`}
              width="1200"
              height="800"
              className="border-2"
            ></iframe>
            <button
              onClick={handleVerify}
              className={`${
                selectedHandwerker.verified ? 'bg-red-600' : 'bg-green-600'
              } text-white px-4 py-2 rounded mt-4 hover:${
                selectedHandwerker.verified ? 'bg-red-700' : 'bg-green-700'
              } transition`}
            >
              {selectedHandwerker.verified ? 'Verifizierung aufheben' : 'Vertrag bestätigen & verifizieren'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
