import React, { useState } from 'react';
import { BenutzerDaten } from '../app/dashboard/page'; 

interface PersoenlicheDatenModalProps {
  initialBenutzerDaten: BenutzerDaten;
  onSave: (updatedUserData: BenutzerDaten) => void;
  onCancel: () => void;
}

const PersoenlicheDatenModal: React.FC<PersoenlicheDatenModalProps> = ({ initialBenutzerDaten, onSave, onCancel }) => {
  const [benutzerDaten, setBenutzerDaten] = useState(initialBenutzerDaten);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBenutzerDaten((prevDaten) => ({
      ...prevDaten,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://localhost:8080/updateUserData', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(benutzerDaten),
      });

      if (response.ok) {
        const data = await response.json();
        onSave(data); 
      } else {
        const errorData = await response.json();
      }
    } catch (error) {
        console.log('Ein unerwarteter Fehler ist aufgetreten');
    }

  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Daten bearbeiten</h2>

        <div className="mb-4">
          <label className="block text-gray-700">Vorname</label>
          <input
            type="text"
            name="vorname"
            value={benutzerDaten.vorname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Nachname</label>
          <input
            type="text"
            name="nachname"
            value={benutzerDaten.nachname}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={benutzerDaten.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Stadt</label>
          <input
            type="text"
            name="stadt"
            value={benutzerDaten.stadt}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Straße</label>
          <input
            type="text"
            name="straße"
            value={benutzerDaten.straße}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Telefon</label>
          <input
            type="text"
            name="telefon"
            value={benutzerDaten.telefon}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Stundenlohn</label>
          <input
            type="text"
            name="stundenlohn"
            value={benutzerDaten.stundenlohn}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={onCancel} className="bg-gray-300 text-gray-700 py-2 px-4 rounded mr-2">
            Abbrechen
          </button>
          <button onClick={handleSave} className="bg-yellow-600 text-white py-2 px-4 rounded">
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default PersoenlicheDatenModal; 