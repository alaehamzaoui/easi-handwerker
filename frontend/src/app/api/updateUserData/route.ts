import { NextApiRequest, NextApiResponse } from 'next';

// Dummy-Datenbankabfrage-Funktion (Ersetze dies durch echte Datenbankoperationen)
const updateUserDataInDatabase = async (id: string, data: Partial<UserData>) => {
  // Beispiel einer Datenbankaktualisierung
  // db.users.update({ id: id }, { ...data });
  return { success: true }; // Rückgabe von Erfolg
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, ...updatedData } = req.body;

    try {
      const result = await updateUserDataInDatabase(id, updatedData);

      if (result.success) {
        res.status(200).json({ success: true });
      } else {
        res.status(500).json({ success: false, message: 'Fehler beim Aktualisieren der Benutzerdaten' });
      }
    } catch (error) {
      res.status(500).json({ success: false, message: 'Serverfehler' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Methode ${req.method} nicht erlaubt`);
  }
}
