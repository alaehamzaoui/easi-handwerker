import { ProfileProps } from '../components/Profile';

export const fetchProfileData = async (id: string): Promise<ProfileProps> => {
  // Beispiel-Daten. Ersetze dies durch echte Datenbank-/API-Abfragen.
  const exampleProfiles: { [key: string]: ProfileProps } = {
    '1': { id: '1', name: 'John Doe', bio: 'Software Developer' },
    '2': { id: '2', name: 'Jane Smith', bio: 'Graphic Designer' },
  };

  return exampleProfiles[id] || { id, name: 'Unknown', bio: 'No bio available' };
};
export type { ProfileProps };

