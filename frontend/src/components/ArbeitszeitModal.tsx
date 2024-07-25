import React from 'react';
import { useState, useEffect } from 'react';

interface Arbeitszeit {
  tag: string;
  von: string;
  bis: string;
}

interface ArbeitszeitModalProps {
  initialArbeitszeiten: Arbeitszeit[];
  onSave: (arbeitszeiten: Arbeitszeit[]) => void;
  onCancel: () => void;
}

const ArbeitszeitModal: React.FC<ArbeitszeitModalProps> = ({ initialArbeitszeiten, onSave, onCancel }) => {
  const [tempArbeitszeiten, setTempArbeitszeiten] = useState<Arbeitszeit[]>(initialArbeitszeiten);
  const [fehler, setFehler] = useState<string | null>(null);

  useEffect(() => {
    setTempArbeitszeiten(initialArbeitszeiten);
  }, [initialArbeitszeiten]);

  const handleChange = (index: number, field: 'von' | 'bis', value: string) => {
    const aktualisierteArbeitszeiten = [...tempArbeitszeiten];
    aktualisierteArbeitszeiten[index][field] = value;
    setTempArbeitszeiten(aktualisierteArbeitszeiten);
  };

  const handleSave = () => {
    for (const arbeitszeit of tempArbeitszeiten) {
      if (arbeitszeit.von && arbeitszeit.bis && arbeitszeit.von >= arbeitszeit.bis) {
        setFehler(`Ungültige Zeit für ${arbeitszeit.tag}: 'Von' Zeit muss vor der 'Bis' Zeit liegen.`);
        return;
      }
    }
    setFehler(null);
    onSave(tempArbeitszeiten);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-secondary p-6 rounded shadow-lg text-primary">
        <h2 className="text-xl font-bold mb-4">Arbeitszeiten aktualisieren</h2>
        {fehler && <p className="text-red-500 mb-4">{fehler}</p>}
        <div className="space-y-4">
          {tempArbeitszeiten.map((arbeitszeit, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-24">{arbeitszeit.tag}</span>
              <input
                type="time"
                className="border p-2"
                value={arbeitszeit.von}
                onChange={(e) => handleChange(index, 'von', e.target.value)}
              />
              <input
                type="time"
                className="border p-2"
                value={arbeitszeit.bis}
                onChange={(e) => handleChange(index, 'bis', e.target.value)}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
            onClick={onCancel}
          >
            Abbrechen
          </button>
          <button
            className="bg-primary text-secondary py-2 px-4 rounded hover:bg-yellow-600"
            onClick={handleSave}
          >
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArbeitszeitModal;
