"use client";

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import users from '../../../public/users.json'; // Adjust the path accordingly
import logo from "../../images/MiniMeister-Logo-white.png";

interface Handwerker {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  category: string;
  phone: string;
  picture: string;
}

export default function Home() {
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [filteredHandwerker, setFilteredHandwerker] = useState<Handwerker[]>(users);

  useEffect(() => {
    const newFilteredHandwerker = users.filter(handwerker =>
      (category === '' || handwerker.category.toLowerCase().includes(category.toLowerCase())) &&
      (city === '' || handwerker.city.toLowerCase().includes(city.toLowerCase()))
    );
    setFilteredHandwerker(newFilteredHandwerker);
  }, [category, city]);

  const uniqueCategories = [...new Set(users.map(handwerker => handwerker.category))];
  const uniqueCities = [...new Set(users.map(handwerker => handwerker.city))];

  const handleCardClick = (id: number) => {
    router.push(`/profile/${id}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-yellow-500 text-gray-800 p-4 flex items-center relative" style={{ height: '100px' }}>
        <div className="absolute left-0 top-0 bg-black h-full p-4 flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <Image src={logo} alt="Logo" width={100} height={100} />
        </div>
      </header>
      <main className="flex-grow bg-gray-100 text-gray-800 p-8">
        <h1 className="text-4xl font-bold mb-12 text-center tracking-wider drop-shadow-lg">Stellen Sie jetzt Ihren Auftrag ein!</h1>
        <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 mb-12 justify-center items-center">
          <div className="relative w-full md:w-1/4">
            <input
              type="text"
              list="categories"
              placeholder="z.B. Elektriker"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:border-yellow-500 shadow-lg transition-transform transform hover:scale-105"
            />
            <datalist id="categories">
              {uniqueCategories.map((cat, index) => (
                <option key={index} value={cat} />
              ))}
            </datalist>
          </div>
          <div className="relative w-full md:w-1/4">
            <input
              type="text"
              list="cities"
              placeholder="z.B. Berlin"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg bg-white text-gray-700 placeholder-gray-500 focus:outline-none focus:border-yellow-500 shadow-lg transition-transform transform hover:scale-105"
            />
            <datalist id="cities">
              {uniqueCities.map((city, index) => (
                <option key={index} value={city} />
              ))}
            </datalist>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:w-3/4 mx-auto">
          {filteredHandwerker.map((handwerker) => (
            <div 
              key={handwerker.id} 
              onClick={() => handleCardClick(handwerker.id)}
              className="border border-gray-300 p-8 rounded-xl shadow-2xl bg-white transition transform hover:-translate-y-2 hover:shadow-3xl hover:bg-gray-200 cursor-pointer flex flex-col items-center"
            >
              <img src={handwerker.picture} alt={handwerker.firstName} className="w-24 h-24 rounded-full mb-4" />
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Vorname:</strong> {handwerker.firstName}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Nachname:</strong> {handwerker.lastName}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Stadt:</strong> {handwerker.city}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Kategorie:</strong> {handwerker.category}</p>
              <p className="text-gray-800 text-lg"><strong className="text-yellow-500">Telefonnummer:</strong> {handwerker.phone}</p>
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
