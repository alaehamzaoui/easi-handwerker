"use client";

import { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimesCircle, FaSignOutAlt, FaLifeRing, FaHammer } from 'react-icons/fa';

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

interface SupportRequest {
  ID: number;
  email: string;
  betreff: string;
  anfrage: string;
  geantwortet: boolean;
  CreatedAt: string;
}

const Admin = () => {
  const [handwerkers, setHandwerkers] = useState<BenutzerDaten[]>([]);
  const [supportRequests, setSupportRequests] = useState<SupportRequest[]>([]);
  const [isadmin, setAdmin] = useState<BenutzerDaten | null>(null);
  const [selectedPage, setSelectedPage] = useState<'Handwerkers' | 'Support'>('Handwerkers');
  const [showPopup, setShowPopup] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<SupportRequest | null>(null);
  const [antwortText, setAntwortText] = useState('');

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
    if (selectedPage === 'Handwerkers') {
      fetchHandwerkers();
    } else if (selectedPage === 'Support') {
      fetchSupportRequests();
    }
  }, [selectedPage]);

  const fetchHandwerkers = () => {
    fetch('http://localhost:8080/searchHandwerker')
      .then((response) => response.json())
      .then((data) => {
        setHandwerkers(data);
      })
      .catch((error) => console.error('Error fetching handwerkers:', error));
  };

  const fetchSupportRequests = () => {
    fetch('http://localhost:8080/GetRequests')
      .then((response) => response.json())
      .then((data) => {
        setSupportRequests(data);
      })
      .catch((error) => console.error('Error fetching support requests:', error));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isadmin');
    window.location.href = '/login';
  };

  const handleAntwortPopup = (request: SupportRequest) => {
    setSelectedRequest(request);
    setShowPopup(true);
  };

  const handleClosePopup = (e: any) => {
    if (e.target.classList.contains('popup-overlay')) {
      setShowPopup(false);
    }
  };

  const handleSendAntwort = () => {
    if (selectedRequest) {
     alert ("Email wurde gesendet");
    }
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 text-black">
      <aside className="bg-yellow-600 w-64 flex flex-col p-6">
        <h1 className="text-4xl font-bold mb-10">MiniMeister</h1>
        <nav>
          <ul>
            <li className={`mb-4 ${selectedPage === 'Handwerkers' ? 'font-bold text-white' : ''}`}>
              <button
                className="flex items-center text-lg font-semibold hover:text-white transition-colors"
                onClick={() => setSelectedPage('Handwerkers')}
              >
                <FaHammer className="mr-2" /> Handwerkers
              </button>
            </li>
            <li className={`mb-4 ${selectedPage === 'Support' ? 'font-bold text-white' : ''}`}>
              <button
                className="flex items-center text-lg font-semibold hover:text-white transition-colors"
                onClick={() => setSelectedPage('Support')}
              >
                <FaLifeRing className="mr-2" /> Support
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-yellow-600 p-6 flex justify-between items-center">
          {isadmin && <span className="text-2xl font-bold">{`${isadmin.email}`}</span>}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 flex items-center transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Ausloggen
          </button>
        </header>

        <main className="flex-grow container mx-auto p-6">
          {selectedPage === 'Handwerkers' ? (
            <>
              <h2 className="text-2xl font-bold mt-8 mb-4">Handwerker Liste</h2>
              {/* Handwerker table logic here */}
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mt-8 mb-4">Support Anfragen</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-3">
                  <table className="bg-white table-auto w-full shadow-md rounded text-center mb-8">
                    <thead className="bg-gray-200">
                      <tr>
                        <th className="px-4 py-2">ID</th>
                        <th className="px-4 py-2">Handwerker Email</th>
                        <th className="px-4 py-2">Betreff</th>
                        <th className="px-4 py-2">Erstellt am</th>
                        <th className="px-4 py-2">Geantwortet</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supportRequests.length > 0 ? (
                        supportRequests.map((request, index) => (
                          <tr key={index} className="border-t">
                            <td className="px-4 py-2">{request.ID}</td>
                            <td className="px-4 py-2">{request.email}</td>
                            <td className="px-4 py-2">{request.betreff}</td>
                            <td className="px-4 py-2">{new Date(request.CreatedAt).toLocaleDateString()}</td>
                            <td className="px-4 py-2">
                                {request.geantwortet ? (
                                <FaCheckCircle className="text-green-500 text-2xl mx-auto" />
                                ) : (
                                <button
                                  onClick={() => handleAntwortPopup(request)}
                                  className="text-blue-500 underline mx-auto"
                                >
                                  Antwort senden
                                </button>
                                )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-2">Keine Anfragen vorhanden.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {showPopup && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 popup-overlay" onClick={handleClosePopup}>
          <div className="bg-white p-6 rounded shadow-lg text-left w-2/3 max-w-2xl relative">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-full hover:bg-red-700 transition"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold mb-4">Support Anfrage</h3>

            <div className="mb-4">
              <label className="block font-semibold">Email:</label>
              <input
                type="text"
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                value={selectedRequest.email}
                readOnly
              />
            </div>


            <div className="mb-4">
              <label className="block font-semibold">Anfrage:</label>
              <textarea
                className="w-full p-2 border rounded bg-gray-100 cursor-not-allowed"
                value={selectedRequest.anfrage}
                readOnly
              />
            </div>

            <div className="mb-4">    
              <label className="block font-semibold">Antwort:</label>
              <textarea
                className="w-full h-64 p-2 border rounded"
                placeholder="Antwort eingeben"
                value={antwortText}
                onChange={(e) => setAntwortText(e.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSendAntwort}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Antwort Email senden
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
