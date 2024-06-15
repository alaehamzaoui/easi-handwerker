import { useState, useEffect } from 'react';

interface WorkTime {
  day: string;
  from: string;
  to: string;
}

interface WorkTimeModalProps {
  initialWorkTimes: WorkTime[];
  onSave: (workTimes: WorkTime[]) => void;
  onCancel: () => void;
}

const WorkTimeModal: React.FC<WorkTimeModalProps> = ({ initialWorkTimes, onSave, onCancel }) => {
  const [tempWorkTimes, setTempWorkTimes] = useState<WorkTime[]>(initialWorkTimes);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTempWorkTimes(initialWorkTimes);
  }, [initialWorkTimes]);

  const handleChange = (index: number, field: 'from' | 'to', value: string) => {
    const updatedWorkTimes = [...tempWorkTimes];
    updatedWorkTimes[index][field] = value;
    setTempWorkTimes(updatedWorkTimes);
  };

  const handleSave = () => {
    for (const workTime of tempWorkTimes) {
      if (workTime.from && workTime.to && workTime.from >= workTime.to) {
        setError(`Ungültige Zeit für ${workTime.day}: 'Von' Zeit muss vor der 'Bis' Zeit liegen.`);
        return;
      }
    }
    setError(null);
    onSave(tempWorkTimes);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="bg-secondary p-6 rounded shadow-lg text-primary">
        <h2 className="text-xl font-bold mb-4">Arbeitszeiten aktualisieren</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="space-y-4">
          {tempWorkTimes.map((workTime, index) => (
            <div key={index} className="flex items-center space-x-4">
              <span className="w-24">{workTime.day}</span>
              <input
                type="time"
                className="border p-2"
                value={workTime.from}
                onChange={(e) => handleChange(index, 'from', e.target.value)}
              />
              <input
                type="time"
                className="border p-2"
                value={workTime.to}
                onChange={(e) => handleChange(index, 'to', e.target.value)}
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

export default WorkTimeModal;
