"use client";

import { useParams, useRouter } from 'next/navigation'; // Using next/navigation for client components
import { useState, useEffect } from 'react';
import users from '../../../../public/users.json'; // Adjust the path if necessary
import worktimes from '../../../../public/worktimes.json'; // Import worktimes.json
import Image from 'next/image';
import logo from "../../../images/MiniMeister-Logo-white.png"; // Import logo

const ProfileDetails = () => {
  const router = useRouter();
  const { id } = useParams(); // Using useParams from next/navigation

  const [craftsman, setCraftsman] = useState(null);
  const [workTimes, setWorkTimes] = useState([]);

  useEffect(() => {
    if (id) {
      const foundCraftsman = users.find(user => user.id === parseInt(id as string));
      setCraftsman(foundCraftsman);
      if (foundCraftsman && foundCraftsman.email) {
        const userWorkTimes = worktimes[foundCraftsman.email];
        setWorkTimes(userWorkTimes || []);
      }
    }
  }, [id]);

  const getNextTwoWeeks = () => {
    const today = new Date();
    const nextTwoWeeks = [];
    for (let i = 0; i < 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      nextTwoWeeks.push(date);
    }
    return nextTwoWeeks;
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('de-DE', { weekday: 'long' });
  };

  if (!craftsman) {
    return <div>Handwerker nicht gefunden.</div>;
  }

  const { firstName, lastName, city, category, phone, picture } = craftsman;

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
              {getNextTwoWeeks().map((date, index) => {
                const dayName = getDayName(date);
                const workTime = workTimes.find(wt => wt.day === dayName);
                if (!workTime || !workTime.from || !workTime.to) return null;
                return (
                  <button
                    key={index}
                    className="border border-gray-300 p-4 rounded-lg shadow-sm bg-green-200 hover:bg-green-300 transition-colors"
                  >
                    <p className="text-lg font-semibold">{dayName}, {date.toLocaleDateString('de-DE')}</p>
                    <p className="text-gray-600">{workTime.from} - {workTime.to}</p>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <img src={picture} alt={`${firstName} ${lastName}`} className="w-32 h-32 rounded-full mb-4" />
            <h1 className="text-3xl font-bold">{`${firstName} ${lastName}`}</h1>
            <p className="text-gray-600 mb-4">{category}</p>
            <div className="space-y-4">
              <p className="text-lg"><strong className="text-yellow-500">Stadt:</strong> {city}</p>
              <p className="text-lg"><strong className="text-yellow-500">Kategorie:</strong> {category}</p>
              <p className="text-lg"><strong className="text-yellow-500">Telefonnummer:</strong> {phone}</p>
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

export default ProfileDetails;
