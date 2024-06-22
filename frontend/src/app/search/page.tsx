"use client"
import { useState, useEffect } from 'react';
import handwerkerData from "./data/data.js";

interface Handwerker {
  vorname: string;
  nachname: string;
  stadt: string;
  categorie: string;
  telefonnummer: string;
}

export default function Home() {
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

  return (
    <div className="min-h-screen bg-black text-yellow-500 p-6">
      <h1 className="text-4xl font-bold mb-8">Handwerker Search Page</h1>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-8">
        <div className="relative w-full md:w-1/4 searchable-list">
          <input
            type="text"
            list="categories"
            placeholder="Search by category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-yellow-500 rounded bg-black text-white placeholder-yellow-500 focus:outline-none focus:border-yellow-400 peer"
          />
          <svg className="outline-none cursor-pointer fill-yellow-500 absolute transition-all duration-200 h-full w-4 -rotate-90 right-2 top-[50%] -translate-y-[50%]"
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <path d="M0 256l512 512L1024 256z"></path>
          </svg>
          <ul className="absolute option-list overflow-y-scroll max-h-64 w-full bg-black text-white rounded-sm scale-0 opacity-0 transition-all duration-200 origin-top-left">
            {uniqueCategories.map((cat, index) => (
              <li key={index} className="data-option select-none break-words text-sm hover:bg-yellow-500 hover:text-black transition-all duration-200 p-3 cursor-pointer" onClick={() => setCategory(cat)}>
                {cat}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative w-full md:w-1/4 searchable-list">
          <input
            type="text"
            list="cities"
            placeholder="Search by city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-4 py-2 border border-yellow-500 rounded bg-black text-white placeholder-yellow-500 focus:outline-none focus:border-yellow-400 peer"
          />
          <svg className="outline-none cursor-pointer fill-yellow-500 absolute transition-all duration-200 h-full w-4 -rotate-90 right-2 top-[50%] -translate-y-[50%]"
            viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink">
            <path d="M0 256l512 512L1024 256z"></path>
          </svg>
          <ul className="absolute option-list overflow-y-scroll max-h-64 w-full bg-black text-white rounded-sm scale-0 opacity-0 transition-all duration-200 origin-top-left">
            {uniqueCities.map((city, index) => (
              <li key={index} className="data-option select-none break-words text-sm hover:bg-yellow-500 hover:text-black transition-all duration-200 p-3 cursor-pointer" onClick={() => setCity(city)}>
                {city}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="space-y-6 md:w-1/2">
        {filteredHandwerker.map((handwerker, index) => (
          <div key={index} className="border border-yellow-500 p-6 rounded shadow-lg bg-gray-900">
            <p className="text-white"><strong className="text-yellow-500">Vorname:</strong> {handwerker.vorname}</p>
            <p className="text-white"><strong className="text-yellow-500">Nachname:</strong> {handwerker.nachname}</p>
            <p className="text-white"><strong className="text-yellow-500">Stadt:</strong> {handwerker.stadt}</p>
            <p className="text-white"><strong className="text-yellow-500">Categorie:</strong> {handwerker.categorie}</p>
            <p className="text-white"><strong className="text-yellow-500">Telefonnummer:</strong> {handwerker.telefonnummer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
