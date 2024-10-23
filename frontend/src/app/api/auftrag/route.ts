import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Pfad zu der JSON-Datei
const auftragDateiPfad = path.resolve(process.cwd(), 'public', 'auftrag.json');


export async function POST(req: NextRequest) {
  const {
    name,
    userid,
    straßehausnummer,
    stadtPLZ,
    email,
    tel,
    anliegen,
    ausgewählterTag,    
    startZeit,          
    endZeit

} = await req.json();

  // Aufträge lesen und erstellen
  let auftragData;
  try {
    const data = fs.readFileSync(auftragDateiPfad, 'utf-8');
    auftragData = JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Lesen der Auftragsdatei:', error);
    auftragData = [];
  }

  // Berechnung der Auftrag-ID
  const newId = auftragData.length > 0 ? Math.max(...auftragData.map((auftrag: any) => auftrag.auftragId || 0)) + 1 : 1;


  // Neuer Auftrag mit ID
  const newauftrag = {
    auftragId: newId,
    userid,
    name,
    straßehausnummer,
    stadtPLZ,
    email,
    tel,
    anliegen,
    ausgewählterTag,    
    startZeit,          
    endZeit
  };
  auftragData.push(newauftrag);
  try {
    fs.writeFileSync(auftragDateiPfad, JSON.stringify(auftragData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Schreiben der Auftragsdatei:', error);
    return NextResponse.json({ error: 'Fehler beim Speichern des Auftrags' }, { status: 500 });
  }

  
  return NextResponse.json({ message: 'Auftrag erfolgreich erstellt' });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');

  let auftragData;
  try {
    const data = fs.readFileSync(auftragDateiPfad, 'utf-8');
    auftragData = JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Lesen der Auftragsdatei:', error);
    return NextResponse.json({ error: 'Fehler beim Lesen der Auftragsdaten' }, { status: 500 });
  }

  // Filtern der Aufträge des spezifischen Benutzers, beachten dass die userId als String verglichen wird
  const userAuftraege = auftragData.filter((auftrag: any) => auftrag.userid === userId);

  return NextResponse.json(userAuftraege);
}
