"use client";

import { useState, useEffect } from 'react';
import { FaClock, FaUser, FaLifeRing } from 'react-icons/fa';
import Image from 'next/image';
import ArbeitszeitModal from '../../components/ArbeitszeitModal';
import BenutzerDatenModal from '../../components/BenutzerDatenModal';
import SupportFormular from '../../components/SupportFormular';

interface Arbeitszeit {
  tag: string;
  von: string;
  bis: string;
}

interface Auftrag {
  auftragId: number;
  name: string;
  ausgewählterTag: string;
  startZeit: string;
  endZeit: string;
  anliegen: string;
}

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
  bild: { src: string };
  id: string;
}

const Dashboard = () => {
  const [arbeitszeiten, setArbeitszeiten] = useState<Arbeitszeit[]>([]);
  const [auftraege, setAuftraege] = useState<Auftrag[]>([]);
  const [istModalOffen, setIstModalOffen] = useState(false);
  const [istBenutzerDatenModalOffen, setIstBenutzerDatenModalOffen] = useState(false);
  const [istSupportPopupOffen, setIstSupportPopupOffen] = useState(false);
  const [benutzerDaten, setBenutzerDaten] = useState<BenutzerDaten | null>(null);

  useEffect(() => {
    const benutzerDatenString = sessionStorage.getItem('benutzer');
    if (!benutzerDatenString) {
      window.location.href = '/login';
    } else {
      const benutzerDaten = JSON.parse(benutzerDatenString);
      setBenutzerDaten(benutzerDaten);
      fetchArbeitszeiten(benutzerDaten.email);
      fetchAuftraege(benutzerDaten.id);
    }
  }, []);

  const fetchArbeitszeiten = (email: string) => {
    fetch(`/api/workTimes?email=${email}`)
      .then((res) => res.json())
      .then((data) => setArbeitszeiten(data))
      .catch((err) => console.error('Fehler beim Abrufen der Arbeitszeiten:', err));
  };

  const fetchAuftraege = (userId: string) => {
    fetch(`/api/auftrag?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => setAuftraege(data))
      .catch((err) => console.error('Fehler beim Abrufen der Aufträge:', err));
  };

  const handleUpdateArbeitszeit = (aktualisierteArbeitszeiten: Arbeitszeit[]) => {
    fetch('/api/workTimes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: benutzerDaten?.email || '', workTimes: aktualisierteArbeitszeiten }),
    })
      .then((res) => res.json())
      .then(() => fetchArbeitszeiten(benutzerDaten?.email || ''))
      .catch((err) => console.error('Fehler beim Aktualisieren der Arbeitszeiten:', err));
  };

  const handleUpdateBenutzerDaten = (aktualisierteDaten: BenutzerDaten) => {
    fetch('/api/updateUserData', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(aktualisierteDaten),
    })
      .then((res) => res.json())
      .then(() => {
        setBenutzerDaten(aktualisierteDaten);
        sessionStorage.setItem('benutzer', JSON.stringify(aktualisierteDaten));
      })
      .catch((err) => console.error('Fehler beim Aktualisieren der Benutzerdaten:', err));
  };

  const handleShowSupportPopup = () => {
    setIstSupportPopupOffen(true);
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 text-black">
      <aside className="bg-yellow-600 w-64 flex flex-col p-6">
        <h1 className="text-4xl font-bold mb-10">MiniMeister</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <button onClick={handleShowSupportPopup} className="flex items-center text-lg font-semibold hover:text-white transition-colors">
                <FaLifeRing className="mr-2" /> Support
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-yellow-600 p-6 flex justify-between items-center">
          {benutzerDaten && (
            <span className="text-2xl font-bold">{`Willkommen, ${benutzerDaten.vorname}`}</span>
          )}
        </header>

        <main className="flex-grow container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex space-x-4 mb-8">
                <button
                  className="bg-yellow-600 text-black py-2 px-4 rounded hover:bg-yellow-700 flex items-center text-lg font-semibold transition-colors"
                  onClick={() => setIstModalOffen(true)}
                >
                  <FaClock className="mr-2" /> Arbeitszeiten bearbeiten
                </button>

                <button
                  className="bg-yellow-600 text-black py-2 px-4 rounded hover:bg-yellow-700 flex items-center text-lg font-semibold transition-colors"
                  onClick={() => setIstBenutzerDatenModalOffen(true)}
                >
                  <FaUser className="mr-2" /> Persönliche Daten bearbeiten
                </button>
              </div>

              {istModalOffen && (
                <ArbeitszeitModal
                  initialArbeitszeiten={arbeitszeiten}
                  onSave={(aktualisierteArbeitszeiten) => {
                    handleUpdateArbeitszeit(aktualisierteArbeitszeiten);
                    setIstModalOffen(false);
                  }}
                  onCancel={() => setIstModalOffen(false)}
                />
              )}

              {istBenutzerDatenModalOffen && (
                <BenutzerDatenModal
                  initialBenutzerDaten={benutzerDaten}
                  onSave={(aktualisierteDaten) => {
                    handleUpdateBenutzerDaten(aktualisierteDaten);
                    setIstBenutzerDatenModalOffen(false);
                  }}
                  onCancel={() => setIstBenutzerDatenModalOffen(false)}
                />
              )}

              <table className="bg-white table-auto w-full shadow-md rounded text-center">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Tag</th>
                    <th className="px-4 py-2">Von</th>
                    <th className="px-4 py-2">Bis</th>
                  </tr>
                </thead>
                <tbody>
                  {arbeitszeiten.map((arbeitszeit, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-2">{arbeitszeit.tag}</td>
                      <td className="px-4 py-2">{arbeitszeit.von}</td>
                      <td className="px-4 py-2">{arbeitszeit.bis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h2 className="text-2xl font-bold mt-8 mb-4">Ihre Aufträge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auftraege.map((auftrag, index) => (
                  <div key={index} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-yellow-200 hover:bg-yellow-300 transition-colors">
                    <p className="text-lg font-semibold">{auftrag.ausgewählterTag}</p>
                    <p className="text-gray-700">{auftrag.startZeit} - {auftrag.endZeit}</p>
                    <p className="text-gray-600">{auftrag.anliegen}</p>
                  </div>
                ))}
              </div>
            </div>

            {benutzerDaten && (
              <div className="bg-white shadow-md rounded p-6 text-center">
                <Image
                  className="w-32 h-32 rounded-full mx-auto mb-4"
                  src={benutzerDaten.bild.src}
                  alt="Persönliche Daten"
                  width={128}
                  height={128}
                />
                <h2 className="text-yellow-600 text-xl font-bold">{`${benutzerDaten.vorname} ${benutzerDaten.nachname}`}</h2>
                <p className="text-gray-600">{benutzerDaten.kategorie}</p>
                <p className="text-gray-600">{benutzerDaten.stadt}</p>
                <p className="text-gray-600">{benutzerDaten.straße}</p>
                <p className="text-gray-600">{benutzerDaten.telefon}</p>
                <p className="text-gray-600">{benutzerDaten.stundenlohn}€</p>
              </div>
            )}
          </div>
        </main>
      </div>

      
      {istSupportPopupOffen && (
        <div className="fixed inset-0 bg-gray-700 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
            <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Support</h3>
            <p className="text-gray-600 mb-4 text-center">Haben Sie Fragen oder benötigen Sie Hilfe? Kontaktieren Sie unseren Support!</p>
            <SupportFormular />
            <button 
              onClick={() => setIstSupportPopupOffen(false)}
              className="mt-4 bg-yellow-600 text-white py-2 px-4 rounded w-full hover:bg-yellow-500"
            >
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
