import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Pfad zur JSON-Datei
const workTimesFilePath = path.resolve(process.cwd(), 'public', 'workTimes.json');

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email erforderlich' }, { status: 400 });
  }

  const workTimesData = JSON.parse(fs.readFileSync(workTimesFilePath, 'utf-8'));

  if (!workTimesData[email]) {
    return NextResponse.json({ error: 'Keine Arbeitszeiten gefunden' }, { status: 404 });
  }

  return NextResponse.json(workTimesData[email]);
}

export async function POST(req: NextRequest) {
  const { email, workTimes } = await req.json();

  if (!email || !workTimes) {
    return NextResponse.json({ error: 'Email und Arbeitszeiten erforderlich' }, { status: 400 });
  }

  const workTimesData = JSON.parse(fs.readFileSync(workTimesFilePath, 'utf-8'));
  workTimesData[email] = workTimes;

  fs.writeFileSync(workTimesFilePath, JSON.stringify(workTimesData, null, 2), 'utf-8');
  return NextResponse.json({ message: 'Arbeitszeiten erfolgreich aktualisiert' });
}
