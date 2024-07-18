import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';


const dataFilePath = path.resolve(process.cwd(), 'public', 'users.json');

console.log('Pfad zur Benutzerdaten-Datei:', dataFilePath);

export async function POST(request: Request) {
    const { email, password } = await request.json();

    console.log('Anmeldedaten erhalten:', { email, password });

    let users = [];

    // Sicherstellen, dass das Verzeichnis und die Datei existieren
    if (!fs.existsSync(path.dirname(dataFilePath))) {
        console.error('Verzeichnis existiert nicht:', path.dirname(dataFilePath));
        fs.mkdirSync(path.dirname(dataFilePath), { recursive: true });
    }

    if (!fs.existsSync(dataFilePath)) {
        console.error('Datei existiert nicht:', dataFilePath);
        fs.writeFileSync(dataFilePath, '[]');
    }

    try {
        const data = fs.readFileSync(dataFilePath, 'utf8');
  
        users = JSON.parse(data);
       
    } catch (error) {
        console.error('Fehler beim Lesen der Benutzerdaten:', error);
    }

    const user = users.find((user: { email: string, password: string }) => user.email === email && user.password === password);

    if (user) {
        return NextResponse.json({ message: 'Login erfolgreich', user }, { status: 200 });
    } else {
        return NextResponse.json({ error: 'Ungültige Anmeldedaten' }, { status: 401 });
    }
}
