import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Pfad zur JSON-Datei
const userFilePath = path.join(process.cwd(), 'public', 'users.json');

// POST-Methode für die API
export async function POST(request: Request) {
  const updatedUserData = await request.json();

  try {
    // Lade die aktuellen Benutzer aus der JSON-Datei
    const users = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));

    // Finde den entsprechenden Benutzer
    const userIndex = users.findIndex((user: any) => user.id === updatedUserData.id);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'Benutzer nicht gefunden' }, { status: 404 });
    }

    // Passwort nur aktualisieren, wenn es im Request enthalten ist und nicht leer ist
    if (updatedUserData.passwort) {
        // Das Passwort speichern
        users[userIndex].passwort = updatedUserData.passwort;
      }

    // Aktualisiere die anderen Felder des Benutzers
    users[userIndex] = {
      ...users[userIndex],
      vorname: updatedUserData.vorname,
      nachname: updatedUserData.nachname,
      telefon: updatedUserData.telefon,
      // Weitere Felder, die aktualisiert werden sollen
    };

    // Schreibe die aktualisierten Benutzerdaten zurück in die JSON-Datei
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));

    return NextResponse.json({ message: 'Benutzerdaten erfolgreich aktualisiert' }, { status: 200 });
  } catch (error) {
    console.error('Fehler beim Aktualisieren der Benutzerdaten:', error);
    return NextResponse.json({ error: 'Fehler beim Aktualisieren der Benutzerdaten' }, { status: 500 });
  }
}
