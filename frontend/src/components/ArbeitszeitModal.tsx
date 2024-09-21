import React, { useState, useEffect } from 'react';

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

// Feste Reihenfolge der Wochentage
const wochentageReihenfolge: string[] = [
  'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'
];

// Mapping zur schnellen Sortierung der Wochentage
const getWeekdayOrder = (): { [key: string]: number } => {
  return wochentageReihenfolge.reduce((acc, day, index) => {
    acc[day] = index + 1;
    return acc;
  }, {} as { [key: string]: number });
};

const ArbeitszeitModal: React.FC<ArbeitszeitModalProps> = ({ initialArbeitszeiten, onSave, onCancel }) => {
  const [tempArbeitszeiten, setTempArbeitszeiten] = useState<Arbeitszeit[]>([]);
  const [fehler, setFehler] = useState<string | null>(null);
  const weekdayOrder = getWeekdayOrder(); // Feste Wochentags-Reihenfolge für Sortierung

  useEffect(() => {
    // Sortiere die Arbeitszeiten basierend auf der festen Wochentags-Reihenfolge
    const sortierteArbeitszeiten = [...initialArbeitszeiten].sort(
      (a, b) => weekdayOrder[a.tag] - weekdayOrder[b.tag]
    );
    setTempArbeitszeiten(sortierteArbeitszeiten);
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-lg text-gray-800 max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-yellow-600">Arbeitszeiten aktualisieren</h2>
        {fehler && <p className="text-red-500 mb-4">{fehler}</p>}
        
        {/* Grid Layout for consistent spacing */}
        <div className="grid grid-cols-3 gap-4">
          {tempArbeitszeiten.map((arbeitszeit, index) => (
            <React.Fragment key={index}>
              <span className="font-medium text-gray-700 flex items-center">{arbeitszeit.tag}</span>
              <input
                type="time"
                className="border border-gray-300 p-2 rounded focus:border-yellow-500 focus:outline-none"
                value={arbeitszeit.von || ''}  // Sicherstellen, dass der Wert nicht undefined ist
                onChange={(e) => handleChange(index, 'von', e.target.value)}
              />
              <input
                type="time"
                className="border border-gray-300 p-2 rounded focus:border-yellow-500 focus:outline-none"
                value={arbeitszeit.bis || ''}  // Sicherstellen, dass der Wert nicht undefined ist
                onChange={(e) => handleChange(index, 'bis', e.target.value)}
              />
            </React.Fragment>
          ))}
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <button
            className="bg-gray-500 text-white py-2 px-6 rounded hover:bg-gray-600 transition duration-200"
            onClick={onCancel}
          >
            Abbrechen
          </button>
          <button
            className="bg-yellow-600 text-white py-2 px-6 rounded hover:bg-yellow-700 transition duration-200"
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
