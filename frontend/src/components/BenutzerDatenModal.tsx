import { useState } from 'react';

interface BenutzerDaten {
  vorname: string;
  nachname: string;
  email: string;
  passwort?: string;
  kategorie: string;
  stadt: string;
  straße: string;
  telefon: string;
  stundenlohn: string;
  bild: { src: string };
  id: string;
}

interface BenutzerDatenModalProps {
  initialBenutzerDaten: BenutzerDaten;
  onSave: (daten: BenutzerDaten) => void;
  onCancel: () => void;
}

const BenutzerDatenModal = ({ initialBenutzerDaten, onSave, onCancel }: BenutzerDatenModalProps) => {
  const [formData, setFormData] = useState<BenutzerDaten>(initialBenutzerDaten);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-2xl mb-4">Persönliche Daten bearbeiten</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Vorname</label>
          <input
            name="vorname"
            value={formData.vorname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Nachname</label>
          <input
            name="nachname"
            value={formData.nachname}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Telefonnummer</label>
          <input
            name="telefon"
            value={formData.telefon}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Passwort</label>
          <input
            type="password"
            name="passwort"
            value={formData.passwort || ''}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>

        <div className="flex justify-end">
          <button onClick={onCancel} className="bg-gray-300 p-2 rounded mr-4">
            Abbrechen
          </button>
          <button onClick={handleSubmit} className="bg-yellow-600 text-white p-2 rounded">
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default BenutzerDatenModal;
