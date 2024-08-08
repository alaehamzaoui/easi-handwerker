import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Pfad zu der JSON-Datei
const orderFilePath = path.resolve(process.cwd(), 'public', 'order.json');


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
  let orderData;
  try {
    const data = fs.readFileSync(orderFilePath, 'utf-8');
    orderData = JSON.parse(data);
  } catch (error) {
    console.error('Fehler beim Lesen der Auftragsdatei:', error);
    orderData = [];
  }

  // Berechnung der Auftrag-ID
  const newId = orderData.length > 0 ? Math.max(...orderData.map((order: any) => order.orderId || 0)) + 1 : 1;


  // Neuer Auftrag mit ID
  const newOrder = {
    orderId: newId,
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
  orderData.push(newOrder);
  try {
    fs.writeFileSync(orderFilePath, JSON.stringify(orderData, null, 2), 'utf-8');
  } catch (error) {
    console.error('Fehler beim Schreiben der Auftragsdatei:', error);
    return NextResponse.json({ error: 'Fehler beim Speichern des Auftrags' }, { status: 500 });
  }

  
  return NextResponse.json({ message: 'Auftrag erfolgreich erstellt' });
}
