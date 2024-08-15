import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import dachdecker from '../../../images/dachdecker.png';
import maler from '../../../images/maler.png';
import elektriker from '../../../images/elektiker.png';
import friseur from '../../../images/friseur.png';
import mauerer from '../../../images/mauerer.png';
import { StaticImageData } from 'next/image';

// Pfade zu den JSON-Dateien
const usersFilePath = path.resolve(process.cwd(), 'public', 'users.json');
const workTimesFilePath = path.resolve(process.cwd(), 'public', 'workTimes.json');

// Standard-Arbeitszeiten
const defaultWorkTimes = [
  { tag: 'Montag', von: '', bis: '' },
  { tag: 'Dienstag', von: '', bis: '' },
  { tag: 'Mittwoch', von: '', bis: '' },
  { tag: 'Donnerstag', von: '', bis: '' },
  { tag: 'Freitag', von: '', bis: '' },
  { tag: 'Samstag', von: '', bis: '' },
  { tag: 'Sonntag', von: '', bis: '' }
];

export async function POST(req: NextRequest) {
  const {
    vorname,
    nachname,
    geburtsdatum,
    kategorie,
    straße,
    stadt,
    telefon,
    email,
    passwort,
    stundenlohn,
    bild,
    
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
  //const defaultBild = '/images/dachdecker.png';
var defaultBild: string | StaticImageData = '';
  switch (kategorie) {
    case 'Maler/-in':
      defaultBild = maler;
      break;
    case 'Elektriker/-in':
      defaultBild = elektriker;
      break;
    case 'Friseur/-in':
      defaultBild = friseur;
      break;
    case 'Maurer/-in':
      defaultBild = mauerer;
      break;
    case 'Dachdecker/-in':
      defaultBild = dachdecker;
      break;
   
  }

  // Neues Benutzerobjekt mit ID
  const newUser = {
    id: newId,
    vorname,
    nachname,
    geburtsdatum,
    kategorie,
    straße,
    stadt,
    telefon,
    email,
    passwort,
    stundenlohn,
    bild: defaultBild,
    verified: false
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
