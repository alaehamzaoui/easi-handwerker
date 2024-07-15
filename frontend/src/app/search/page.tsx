"use client";  // Mark this file as a Client Component

import { useRouter } from 'next/navigation'; // Update the import
import { useState, useEffect } from 'react';
import handwerkerData from "../data/data";

interface Handwerker {
  id: number;
  vorname: string;
  nachname: string;
  stadt: string;
  categorie: string;
  telefonnummer: string;
}

export default function Home() {
  const router = useRouter();

  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const [filteredHandwerker, setFilteredHandwerker] = useState<Handwerker[]>(handwerkerData);

  useEffect(() => {
    const newFilteredHandwerker = handwerkerData.filter(handwerker =>
      (category === '' || handwerker.categorie.toLowerCase().includes(category.toLowerCase())) &&
      (city === '' || handwerker.stadt.toLowerCase().includes(city.toLowerCase()))
    );
    setFilteredHandwerker(newFilteredHandwerker);
  }, [category, city]);

  useEffect(() => {
    const initDropdown = (selector: string) => {
      const el = document.querySelector(selector) as HTMLElement;
      const listEl = el.querySelector('.option-list') as HTMLElement;
      const arrow = el.querySelector('svg') as unknown as HTMLElement;
      const input = el.querySelector('input') as HTMLInputElement;

      let listOpened = false;

      const showList = () => {
        listOpened = true;
        listEl.classList.add('opacity-100', 'scale-100');
        arrow.classList.add('rotate-0');
      };

      const hideList = () => {
        listOpened = false;
        listEl.classList.remove('opacity-100', 'scale-100');
        arrow.classList.remove('rotate-0');
      };

      arrow.onclick = () => {
        listOpened ? hideList() : showList();
      };

      input.oninput = (e: Event) => {
        const searchTerm = (e.target as HTMLInputElement).value.toLowerCase();
        const listItems = el.querySelectorAll('.data-option') as NodeListOf<HTMLElement>;
        listItems.forEach((item) => {
          const text = item.textContent?.toLowerCase() || '';
          if (text.includes(searchTerm)) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });
      };

      input.onclick = () => {
        showList();
        const listItems = el.querySelectorAll('.data-option') as NodeListOf<HTMLElement>;
        listItems.forEach((item) => {
          item.classList.remove('hidden');
        });
      };

      input.onblur = () => {
        hideList();
      };

      const listItems = el.querySelectorAll('.data-option') as NodeListOf<HTMLElement>;
      listItems.forEach((item) => {
        item.onmousedown = (e) => {
          input.value = (e.target as HTMLElement).textContent || '';
          hideList();
        };
      });
    };

    initDropdown('.searchable-list:nth-of-type(1)');
    initDropdown('.searchable-list:nth-of-type(2)');
  }, []);

  const uniqueCategories = [...new Set(handwerkerData.map(handwerker => handwerker.categorie))];
  const uniqueCities = [...new Set(handwerkerData.map(handwerker => handwerker.stadt))];

  const handleCardClick = (id: number) => {
    router.push(`/profile/${id}`);
  };

  return (
    <div className="min-h-screen bg-black text-yellow-500 p-8">
      <h1 className="text-4xl font-bold mb-12 text-center tracking-wider drop-shadow-lg">Stellen Sie jetzt Ihren Auftrag ein! </h1>
      <div className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 mb-12 justify-center items-center">
        <div className="relative w-full md:w-1/4 searchable-list">
          <input
            type="text"
            list="categories"
            placeholder="z.B. Elektriker"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-6 py-4 border border-yellow-500 rounded-lg bg-white text-black placeholder-yellow-500 focus:outline-none focus:border-yellow-400 shadow-lg transition-transform transform hover:scale-105"
          />
          <svg className="outline-none cursor-pointer fill-yellow-500 absolute transition-all duration-200 h-full w-4 rotate-90 right-4 top-1/2 transform -translate-y-1/2"
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <path d="M0 256l512 512L1024 256z"></path>
          </svg>
          <ul className="absolute option-list overflow-y-scroll max-h-64 w-full bg-white text-black rounded-lg shadow-lg scale-0 opacity-0 transition-all duration-200 origin-top-left z-10">
            {uniqueCategories.map((cat, index) => (
              <li key={index} className="data-option select-none break-words text-sm hover:bg-yellow-500 hover:text-black transition-all duration-200 p-3 cursor-pointer">
                {cat}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative w-full md:w-1/4 searchable-list">
          <input
            type="text"
            list="cities"
            placeholder="z.B. Berlin"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-6 py-4 border border-yellow-500 rounded-lg bg-white text-black placeholder-yellow-500 focus:outline-none focus:border-yellow-400 shadow-lg transition-transform transform hover:scale-105"
          />
          <svg className="outline-none cursor-pointer fill-yellow-500 absolute transition-all duration-200 h-full w-4 rotate-90 right-4 top-1/2 transform -translate-y-1/2"
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <path d="M0 256l512 512L1024 256z"></path>
          </svg>
          <ul className="absolute option-list overflow-y-scroll max-h-64 w-full bg-white text-black rounded-lg shadow-lg scale-0 opacity-0 transition-all duration-200 origin-top-left z-10">
            {uniqueCities.map((city, index) => (
              <li key={index} className="data-option select-none break-words text-sm hover:bg-yellow-500 hover:text-black transition-all duration-200 p-3 cursor-pointer">
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-8 md:w-3/4 mx-auto">
        {filteredHandwerker.map((handwerker) => (
          <div 
            key={handwerker.id} 
            onClick={() => handleCardClick(handwerker.id)}
            className="border border-yellow-500 p-8 rounded-xl shadow-2xl bg-white transition transform hover:-translate-y-2 hover:shadow-3xl hover:bg-gray-300 cursor-pointer"
          >
            <p className="text-black text-lg"><strong className="text-yellow-500">Vorname:</strong> {handwerker.vorname}</p>
            <p className="text-black text-lg"><strong className="text-yellow-500">Nachname:</strong> {handwerker.nachname}</p>
            <p className="text-black text-lg"><strong className="text-yellow-500">Stadt:</strong> {handwerker.stadt}</p>
            <p className="text-black text-lg"><strong className="text-yellow-500">Kategorie:</strong> {handwerker.categorie}</p>
            <p className="text-black text-lg"><strong className="text-yellow-500">Telefonnummer:</strong> {handwerker.telefonnummer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
