import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Pfade zu den JSON-Dateien
const benutzerDateiPfad = path.resolve(process.cwd(), 'public', 'users.json');
const arbeitszeitenDateiPfad = path.resolve(process.cwd(), 'public', 'workTimes.json');

// Standard-Arbeitszeiten
const standardArbeitszeiten = [
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
    bild
  } = await req.json();

  // Benutzer lesen und hinzufügen
  let benutzerDaten;
  try {
    const daten = fs.readFileSync(benutzerDateiPfad, 'utf-8');
    benutzerDaten = JSON.parse(daten);
  } catch (error) {
    console.error('Fehler beim Lesen der Benutzerdatei:', error);
    benutzerDaten = [];
  }

  // Berechnung der neuen Benutzer-ID
  const neueId = benutzerDaten.length > 0 ? Math.max(...benutzerDaten.map((benutzer: any) => benutzer.id || 0)) + 1 : 1;
  const standardBild = "https://www.w3schools.com/howto/img_avatar.png"

  // Neues Benutzerobjekt mit ID
  const neuerBenutzer = {
    id: neueId,
    vorname,
    nachname,
    geburtsdatum,
    kategorie,
    straße,
    stadt,
    telefon,
    email,
    passwort,
    bild: standardBild
  };

  benutzerDaten.push(neuerBenutzer);

  try {
    fs.writeFileSync(benutzerDateiPfad, JSON.stringify(benutzerDaten, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Schreiben der Benutzerdatei:', error);
    return NextResponse.json({ fehler: 'Fehler beim Speichern des Benutzers' }, { status: 500 });
  }

  // Arbeitszeiten für den neuen Benutzer hinzufügen
  let arbeitszeitenDaten;
  try {
    const daten = fs.readFileSync(arbeitszeitenDateiPfad, 'utf-8');
    arbeitszeitenDaten = JSON.parse(daten);
  } catch (error) {
    console.error('Fehler beim Lesen der Arbeitszeiten-Datei:', error);
    arbeitszeitenDaten = {};
  }

  arbeitszeitenDaten[email] = standardArbeitszeiten;

  try {
    fs.writeFileSync(arbeitszeitenDateiPfad, JSON.stringify(arbeitszeitenDaten, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Schreiben der Arbeitszeiten-Datei:', error);
    return NextResponse.json({ fehler: 'Fehler beim Speichern der Arbeitszeiten' }, { status: 500 });
  }

  return NextResponse.json({ nachricht: 'Benutzer erfolgreich registriert' });
}
