"use client";

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import benutzer from '../../../../public/users.json'; 
import arbeitszeiten from '../../../../public/worktimes.json'; 
import Image from 'next/image';
import logo from "../../../images/MiniMeister-Logo-white.png"; 

const ProfilDetails = () => {
  const router = useRouter();
  const { id } = useParams();

  const [handwerker, setHandwerker] = useState(null);
  const [arbeitsZeiten, setArbeitsZeiten] = useState([]);

  useEffect(() => {
    if (id) {
      const gefundenerHandwerker = benutzer.find(benutzer => benutzer.id === parseInt(id as string));
      setHandwerker(gefundenerHandwerker);
      if (gefundenerHandwerker && gefundenerHandwerker.email) {
        const benutzerArbeitsZeiten = arbeitszeiten[gefundenerHandwerker.email];
        setArbeitsZeiten(benutzerArbeitsZeiten || []);
      }
    }
  }, [id]);

  const getNaechsteZweiWochen = () => {
    const heute = new Date();
    const naechsteZweiWochen = [];
    for (let i = 0; i < 14; i++) {
      const datum = new Date(heute);
      datum.setDate(heute.getDate() + i);
      naechsteZweiWochen.push(datum);
    }
    return naechsteZweiWochen;
  };

  const getTagName = (datum: Date) => {
    return datum.toLocaleDateString('de-DE', { weekday: 'long' });
  };

  if (!handwerker) {
    return <div>Handwerker nicht gefunden.</div>;
  }

  const { vorname, nachname, stadt, kategorie, telefon, bild } = handwerker;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-yellow-500 text-gray-800 p-4 flex items-center relative" style={{ height: '100px' }}>
        <div className="absolute left-0 top-0 bg-black h-full p-4 flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <Image src={logo} alt="Logo" width={100} height={100} />
        </div>
      </header>
      <main className="flex-grow bg-gray-100 text-gray-800 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-12 text-center tracking-wider drop-shadow-lg">Buchen Sie jetzt Ihren Handwerker</h1>
        <div className="flex flex-row w-full max-w-4xl bg-white p-8 rounded-lg shadow-2xl">
          <div className="flex-1 mr-8">
            <h2 className="text-2xl font-bold mb-4">Verfügbare Arbeitszeiten</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getNaechsteZweiWochen().map((datum, index) => {
                const tagName = getTagName(datum);
                const arbeitsZeit = arbeitsZeiten.find(az => az.tag === tagName);
                if (!arbeitsZeit || !arbeitsZeit.von || !arbeitsZeit.bis) return null;
                return (
                  <button
                    key={index}
                    className="border border-gray-300 p-4 rounded-lg shadow-sm bg-green-200 hover:bg-green-300 transition-colors"
                  >
                    <p className="text-lg font-semibold">{tagName}, {datum.toLocaleDateString('de-DE')}</p>
                    <p className="text-gray-600">{arbeitsZeit.von} - {arbeitsZeit.bis}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <img src={bild} alt={`${vorname} ${nachname}`} className="w-32 h-32 rounded-full mb-4" />
            <h1 className="text-3xl font-bold">{`${vorname} ${nachname}`}</h1>
            <p className="text-gray-600 mb-4">{kategorie}</p>
            <div className="space-y-4">
              <p className="text-lg"><strong className="text-yellow-500">Stadt:</strong> {stadt}</p>
              <p className="text-lg"><strong className="text-yellow-500">Kategorie:</strong> {kategorie}</p>
              <p className="text-lg"><strong className="text-yellow-500">Telefonnummer:</strong> {telefon}</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-yellow-500 text-gray-800 p-4 flex justify-center items-center">
        <p>© 2024 MiniMeister. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default ProfilDetails;
