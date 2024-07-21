import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Pfade zu den JSON-Dateien
const usersFilePath = path.resolve(process.cwd(), 'public', 'users.json');
const workTimesFilePath = path.resolve(process.cwd(), 'public', 'workTimes.json');

// Standard-Arbeitszeiten
const defaultWorkTimes = [
  { day: 'Montag', from: '', to: '' },
  { day: 'Dienstag', from: '', to: '' },
  { day: 'Mittwoch', from: '', to: '' },
  { day: 'Donnerstag', from: '', to: '' },
  { day: 'Freitag', from: '', to: '' },
  { day: 'Samstag', from: '', to: '' },
  { day: 'Sonntag', from: '', to: '' }
];

export async function POST(req: NextRequest) {
  const {
    firstName,
    lastName,
    birthDate,
    category,
    street,
    city,
    phone,
    email,
    password,
    bild
  } = await req.json();

  // Benutzer lesen und hinzufügen
  let usersData;
  try {
    const data = fs.readFileSync(usersFilePath, 'utf-8');
    usersData = JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Lesen der Benutzerdatei:', error);
    usersData = [];
  }

  // Berechnung der neuen Benutzer-ID
  const newId = usersData.length > 0 ? Math.max(...usersData.map((user: any) => user.id || 0)) + 1 : 1;
  const defaultBild = "https://www.w3schools.com/howto/img_avatar.png"


  // Neues Benutzerobjekt mit ID
  const newUser = {
    id: newId,
    firstName,
    lastName,
    birthDate,
    category,
    street,
    city,
    phone,
    email,
    password,
    picture : defaultBild
  };

  usersData.push(newUser);

  try {
    fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Schreiben der Benutzerdatei:', error);
    return NextResponse.json({ error: 'Fehler beim Speichern des Benutzers' }, { status: 500 });
  }

  // Arbeitszeiten für den neuen Benutzer hinzufügen
  let workTimesData;
  try {
    const data = fs.readFileSync(workTimesFilePath, 'utf-8');
    workTimesData = JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Lesen der Arbeitszeiten-Datei:', error);
    workTimesData = {};
  }

  workTimesData[email] = defaultWorkTimes;

  try {
    fs.writeFileSync(workTimesFilePath, JSON.stringify(workTimesData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Schreiben der Arbeitszeiten-Datei:', error);
    return NextResponse.json({ error: 'Fehler beim Speichern der Arbeitszeiten' }, { status: 500 });
  }

  return NextResponse.json({ message: 'Benutzer erfolgreich registriert' });
}
