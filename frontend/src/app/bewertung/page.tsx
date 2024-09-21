"use client";
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';  // Verwende useSearchParams für Query-Parameter
import Popup from '../../components/Popup';  // Verwende das Popup-Modalfenster für Meldungen

const BewertungsSeite = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const auftrag_id = searchParams.get('auftrag_id');  // Hole den Auftrag-ID-Parameter

  const [bewertung, setBewertung] = useState<number | null>(null);
  const [nachricht, setNachricht] = useState<string>('');
  const [isPopupVisible, setIsPopupVisible] = useState<boolean>(false);
  const [popupMessage, setPopupMessage] = useState<string>('');

  const handleSubmit = () => {
    if (bewertung === null) {
      setPopupMessage('Bitte wählen Sie eine Bewertung aus.');
      setIsPopupVisible(true);
      return;
    }

    fetch('http://localhost:8080/api/handleBewertung', {  // Passe die API-Route an
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        auftrag_id: Number(auftrag_id),  // Stelle sicher, dass auftrag_id korrekt als Zahl übergeben wird
        bewertung,
        nachricht,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Fehler beim Absenden der Bewertung');
        }
        return res.json();
      })
      .then(() => {
        setPopupMessage('Vielen Dank für Ihre Bewertung!');
        setIsPopupVisible(true);
        setTimeout(() => router.push('/'), 2000);  // Nach 2 Sekunden zur Startseite weiterleiten
      })
      .catch((err) => {
        console.error('Fehler beim Absenden der Bewertung:', err);
        setPopupMessage('Fehler beim Absenden der Bewertung. Bitte versuchen Sie es erneut.');
        setIsPopupVisible(true);
      });
  };

  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 text-black">
      <aside className="bg-yellow-600 w-64 flex flex-col p-6">
        <h1 className="text-4xl font-bold mb-10">MiniMeister</h1>
        {/* Weitere Navigationskomponenten hier */}
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-yellow-600 p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Bewerten Sie Ihren Auftrag</h2>
        </header>

        <main className="flex-grow container mx-auto p-6">
          <div className="bg-white shadow-md rounded p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Auftrag-ID: {auftrag_id}</h2>
            <p className="mb-4">Bitte bewerten Sie unseren Service für Ihren Auftrag.</p>

            <div className="mb-4">
              <p className="font-semibold mb-2">Bewertung:</p>
              <div className="flex space-x-4">
                {[5, 4, 3, 2, 1].map((value) => (
                  <label key={value} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value={value}
                      checked={bewertung === value}
                      onChange={() => setBewertung(value)}
                      className="form-radio h-5 w-5 text-yellow-500"
                    />
                    <span>{value} Sterne</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="font-semibold mb-2">Zusätzliches Feedback:</p>
              <textarea
                value={nachricht}
                onChange={(e) => setNachricht(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
                placeholder="Möchten Sie uns zusätzliches Feedback geben?"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                className="bg-yellow-600 text-white py-2 px-4 rounded hover:bg-yellow-700"
              >
                Bewertung absenden
              </button>
            </div>
          </div>
        </main>

        {/* Popup-Modal für Meldungen */}
        {isPopupVisible && (
          <Popup
            message={popupMessage}
            onClose={closePopup}
          />
        )}
      </div>
    </div>
  );
};

export default BewertungsSeite;
