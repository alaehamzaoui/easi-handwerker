import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Pfad zur JSON-Datei
const workTimesFilePath = path.resolve(process.cwd(), 'public', 'workTimes.json');

export async function GET() {
  const workTimes = fs.readFileSync(workTimesFilePath, 'utf-8');
  return NextResponse.json(JSON.parse(workTimes));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  fs.writeFileSync(workTimesFilePath, JSON.stringify(body, null, 2), 'utf-8');
  return NextResponse.json({ message: 'Work times updated successfully' });
}