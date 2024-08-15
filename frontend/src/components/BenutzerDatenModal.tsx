import { useState } from 'react';

interface BenutzerDatenModalProps {
  initialBenutzerDaten: any;
  onSave: (aktualisierteDaten: any) => void;
  onCancel: () => void;
}

const BenutzerDatenModal = ({ initialBenutzerDaten, onSave, onCancel }: BenutzerDatenModalProps) => {
  const [benutzerDaten, setBenutzerDaten] = useState(initialBenutzerDaten);
  const [passwort, setPasswort] = useState('');
  const [neuesPasswort, setNeuesPasswort] = useState('');

  const handleSave = () => {
    const aktualisierteDaten = { ...benutzerDaten };
    if (neuesPasswort) {
      aktualisierteDaten.neuesPasswort = neuesPasswort; // Neues Passwort nur senden, wenn es angegeben wurde
    }
    onSave(aktualisierteDaten);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded p-6 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Profil bearbeiten</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium">Vorname</label>
          <input
            type="text"
            value={benutzerDaten.vorname}
            onChange={(e) => setBenutzerDaten({ ...benutzerDaten, vorname: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Nachname</label>
          <input
            type="text"
            value={benutzerDaten.nachname}
            onChange={(e) => setBenutzerDaten({ ...benutzerDaten, nachname: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded py-2 px-3"
          />
        </div>
        {/* Weitere Felder für Adresse, Telefonnummer etc. */}
        <div className="mb-4">
          <label className="block text-sm font-medium">Passwort</label>
          <input
            type="password"
            value={passwort}
            onChange={(e) => setPasswort(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded py-2 px-3"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium">Neues Passwort</label>
          <input
            type="password"
            value={neuesPasswort}
            onChange={(e) => setNeuesPasswort(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded py-2 px-3"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onCancel}
            className="mr-4 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300 transition"
          >
            Abbrechen
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition"
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenutzerDatenModal;
