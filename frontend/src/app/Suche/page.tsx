"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from "../../images/MiniMeister-Logo-white.png";
import malerbild from "../../images/maler.png";
import elektrikerbild from "../../images/elektriker.png";
import mauererbild from "../../images/mauerer.png";
import dachdeckerbild from "../../images/dachdecker.png";
import friseurbild from "../../images/friseur.png";
import styles from '../../styles/Suche.module.css';


// Mapping für Kategorien zu Bildern
const handwerkerBilder = {
  "Maler/-in": malerbild,
  "Elektriker/-in": elektrikerbild,
  "Maurer/-in": mauererbild,
  "Dachdecker/-in": dachdeckerbild,
  "Friseur/-in": friseurbild,

};

// Funktion zur Auswahl des passenden Bildes basierend auf der Kategorie
const getBildForKategorie = (kategorie: string) => {
  // Kategorie in Kleinbuchstaben umwandeln und die letzten 3 Zeichen entfernen
  //const key = kategorie.toLowerCase().slice(0, -3);
  return handwerkerBilder[kategorie] || logo; // Fallback-Bild, wenn keine Kategorie passt
};

interface Handwerker {
  id: number;  // Sicherstellen, dass die ID vorhanden ist
  vorname: string;
  nachname: string;
  stadt: string;
  kategorie: string;
  telefon: string;
  bild: string;
}

export default function Startseite() {
  const router = useRouter();
  const [kategorie, setKategorie] = useState('');
  const [stadt, setStadt] = useState('');
  const [gefilterteHandwerker, setGefilterteHandwerker] = useState<Handwerker[]>([]);

  useEffect(() => {
    const fetchHandwerker = async () => {
      try {
        const res = await fetch(`http://localhost:8080/searchHandwerker?kategorie=${kategorie}&stadt=${stadt}`);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log("Erhaltene Daten:", data);  // Überprüfen Sie die Datenstruktur hier
        setGefilterteHandwerker(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der Handwerker:', error);
      }
    };

    fetchHandwerker();
  }, [kategorie, stadt]);

  const eindeutigeKategorien = [...new Set(gefilterteHandwerker.map(handwerker => handwerker.kategorie))];
  const eindeutigeStädte = [...new Set(gefilterteHandwerker.map(handwerker => handwerker.stadt))];

  const handleCardClick = (id?: number) => {
    if (id !== undefined) {
      console.log("Navigiere zu Handwerker mit ID:", id); // Überprüfe, ob die ID korrekt ist
      router.push(`/profile/${id}`);
    } else {
      console.error("Fehler: Handwerker-ID ist undefined");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-yellow-500 text-gray-800 p-4 flex items-center relative" style={{ height: '100px' }}>
        <div className="absolute left-0 top-0 bg-black h-full p-4 flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <Image src={logo} alt="Logo" width={200} height={200}  className={styles.logo}/>
        </div>
      </header>
      <main className="flex-grow bg-gray-100 text-gray-800 p-8">
        <h1 className="text-4xl font-bold mb-12 text-center tracking-wider drop-shadow-lg">Stellen Sie jetzt Ihren Auftrag ein!</h1>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 mb-12 justify-center items-center">
          <div className="relative w-full md:w-1/4">
            <input
              type="text"
              list="kategorien"
              placeholder="z.B. Elektriker"
              value={kategorie}
              onChange={(e) => setKategorie(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:border-yellow-500 shadow-lg transition-transform transform hover:scale-105"
            />
            <datalist id="kategorien">
              {eindeutigeKategorien.map((kat, index) => (
                <option key={index} value={kat} />
              ))}
            </datalist>
          </div>
          <div className="relative w-full md:w-1/4">
            <input
              type="text"
              list="städte"
              placeholder="z.B. Berlin"
              value={stadt}
              onChange={(e) => setStadt(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:border-yellow-500 shadow-lg transition-transform transform hover:scale-105"
            />
            <datalist id="städte">
              {eindeutigeStädte.map((stadt, index) => (
                <option key={index} value={stadt} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:w-3/4 mx-auto">
          {gefilterteHandwerker.map((handwerker) => (
            <div 
              key={handwerker.id} 
              
              onClick={() => handleCardClick(handwerker.id)}
              className="border border-gray-300 p-8 rounded-xl shadow-2xl bg-white transition transform hover:-translate-y-2 hover:shadow-3xl hover:bg-gray-200 cursor-pointer flex flex-col items-center"
            >
              <img
                src={handwerker.bild}
                alt={handwerker.kategorie}
                width={128}
                height={128}
                className="rounded-full"
              />

              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Vorname:</strong> {handwerker.vorname}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Nachname:</strong> {handwerker.nachname}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Stadt:</strong> {handwerker.stadt}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Kategorie:</strong> {handwerker.kategorie}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Telefonnummer:</strong> {handwerker.telefon}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="bg-yellow-500 text-gray-800 p-4 flex justify-center items-center">
        <p>© 2024 MiniMeister. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
