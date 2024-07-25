"use client";

import { useState, useEffect } from 'react';
import ArbeitszeitModal from '../../components/ArbeitszeitModal';
import { FaClock, FaUser, FaHome } from 'react-icons/fa';

interface Arbeitszeit {
  tag: string;
  von: string;
  bis: string;
}

const Dashboard = () => {
  const [arbeitszeiten, setArbeitszeiten] = useState<Arbeitszeit[]>([]);
  const [istModalOffen, setIstModalOffen] = useState(false);
  const [istDunkelModus, setIstDunkelModus] = useState(false);
  const [istLaden, setIstLaden] = useState(true);
  const [benutzerDaten, setBenutzerDaten] = useState<any>(null);

  const toggleTheme = () => {
    setIstDunkelModus(!istDunkelModus);
  };

  const logout = () => {
    sessionStorage.removeItem('benutzer');
    window.location.href = '/login';
  };

  const fetchArbeitszeiten = (email: string) => {
    fetch(`/api/workTimes?email=${email}`)
      .then((res) => res.json())
      .then((data) => setArbeitszeiten(data))
      .catch((err) => console.error('Fehler beim Abrufen der Arbeitszeiten:', err));
  };

  useEffect(() => {
    const benutzerDatenString = sessionStorage.getItem('benutzer');
    if (!benutzerDatenString) {
      window.location.href = '/login';
    } else {
      const benutzerDaten = JSON.parse(benutzerDatenString);
      setBenutzerDaten(benutzerDaten);
      fetchArbeitszeiten(benutzerDaten.email);
      setIstLaden(false);
    }
  }, []);

  const handleUpdateArbeitszeit = (aktualisierteArbeitszeiten: Arbeitszeit[]) => {
    fetch('/api/workTimes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: benutzerDaten.email, workTimes: aktualisierteArbeitszeiten }),
    })
      .then((res) => res.json())
      .then(() => fetchArbeitszeiten(benutzerDaten.email))
      .catch((err) => console.error('Fehler beim Aktualisieren der Arbeitszeiten:', err));
  };

  if (istLaden) {
    return null;
  }

  return (
    <div className={`${istDunkelModus ? 'bg-black text-yellow-500' : 'bg-gray-100 text-black'} min-h-screen flex flex-row`}>
      <aside className={`${istDunkelModus ? 'bg-gray-800 text-white' : 'bg-yellow-600 text-black'} w-64 flex flex-col p-4`}>
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
        <header className={`${istDunkelModus ? 'bg-gray-800 text-white' : 'bg-yellow-600 text-black'} p-4 flex justify-between items-center`}>
          {benutzerDaten && (
            <span className="text-2xl font-bold">{`Willkommen, ${benutzerDaten.vorname}`}</span>
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
              {istDunkelModus ? 'Licht Modus' : 'Dunkel Modus'}
            </button>
          </div>
        </header>

        <main className="flex-grow container mx-auto p-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <button
                className={`${istDunkelModus ? 'bg-gray-800 text-yellow-500' : 'bg-yellow-600 text-black'} py-2 px-4 rounded hover:bg-yellow-700 mb-4 flex items-center`}
                onClick={() => setIstModalOffen(true)}
              >
                <FaClock className="mr-2" /> Zeit pflegen
              </button>

              {istModalOffen && (
                <ArbeitszeitModal
                  initialArbeitszeiten={arbeitszeiten}
                  onSave={(aktualisierteArbeitszeiten) => {
                    handleUpdateArbeitszeit(aktualisierteArbeitszeiten);
                    setIstModalOffen(false);
                  }}
                  onCancel={() => {
                    setIstModalOffen(false);
                    fetchArbeitszeiten(benutzerDaten.email);
                  }}
                />
              )}

              <table className={`${istDunkelModus ? 'bg-gray-900 text-white' : 'bg-white text-black'} table-auto w-full mt-4 shadow-md rounded text-center`}>
                <thead className={`${istDunkelModus ? 'bg-gray-700' : 'bg-gray-200'}`}>
                  <tr>
                    <th className="px-4 py-2">Tag</th>
                    <th className="px-4 py-2">Von</th>
                    <th className="px-4 py-2">Bis</th>
                  </tr>
                </thead>
                <tbody>
                  {arbeitszeiten.map((arbeitszeit, index) => (
                    <tr key={index} className={`${istDunkelModus ? 'border-t border-gray-700' : 'border-t'}`}>
                      <td className="px-4 py-2">{arbeitszeit.tag}</td>
                      <td className="px-4 py-2">{arbeitszeit.von}</td>
                      <td className="px-4 py-2">{arbeitszeit.bis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {benutzerDaten && (
              <div className={`${istDunkelModus ? 'bg-gray-900 text-white' : 'bg-white text-black'} shadow-md rounded p-4 text-center`}>
                <img
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                  src={`${benutzerDaten.bild}`} 
                  alt="Persönliche Daten"
                />
                <h2 className={`${istDunkelModus ? 'text-yellow-500' : 'text-yellow-600'} text-xl font-bold`}>{`${benutzerDaten.vorname} ${benutzerDaten.nachname}`}</h2>
                <p className={`${istDunkelModus ? 'text-gray-400' : 'text-gray-600'}`}>{benutzerDaten.kategorie}</p>
                <p className={`${istDunkelModus ? 'text-gray-400' : 'text-gray-600'}`}>{benutzerDaten.stadt}</p>
                <p className={`${istDunkelModus ? 'text-gray-400' : 'text-gray-600'}`}>{benutzerDaten.straße}</p>
                <p className={`${istDunkelModus ? 'text-gray-400' : 'text-gray-600'}`}>{benutzerDaten.telefon}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
