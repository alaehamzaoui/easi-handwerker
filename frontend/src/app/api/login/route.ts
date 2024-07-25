import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const datenDateiPfad = path.resolve(process.cwd(), 'public', 'users.json');

console.log('Pfad zur Benutzerdaten-Datei:', datenDateiPfad);

export async function POST(request: Request) {
    const { email, passwort } = await request.json();

    console.log('Anmeldedaten erhalten:', { email, passwort });

    let benutzer = [];

    // Sicherstellen, dass das Verzeichnis und die Datei existieren
    if (!fs.existsSync(path.dirname(datenDateiPfad))) {
        console.error('Verzeichnis existiert nicht:', path.dirname(datenDateiPfad));
        fs.mkdirSync(path.dirname(datenDateiPfad), { recursive: true });
    }

    if (!fs.existsSync(datenDateiPfad)) {
        console.error('Datei existiert nicht:', datenDateiPfad);
        fs.writeFileSync(datenDateiPfad, '[]');
    }

    try {
        const daten = fs.readFileSync(datenDateiPfad, 'utf8');
        benutzer = JSON.parse(daten);
    } catch (error) {
        console.error('Fehler beim Lesen der Benutzerdaten:', error);
    }

    const user = benutzer.find((benutzer: { email: string, passwort: string }) => benutzer.email === email && benutzer.passwort === passwort);

    if (user) {
        return NextResponse.json({ nachricht: 'Login erfolgreich', benutzer: user }, { status: 200 });
    } else {
        return NextResponse.json({ fehler: 'Ungültige Anmeldedaten' }, { status: 401 });
    }
}
