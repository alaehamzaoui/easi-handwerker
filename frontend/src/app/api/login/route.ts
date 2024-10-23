import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const datenDateiPfad = path.resolve(process.cwd(), 'public', 'users.json');

console.log('Pfad zur Benutzerdaten-Datei:', datenDateiPfad);

export async function POST(request: Request) {
    const { email, passwort } = await request.json();

    console.log('Anmeldedaten erhalten:', { email, passwort });

    let benutzer = [];

    try {
        // Sicherstellen, dass die Datei existiert
        try {
            await fs.access(datenDateiPfad);
        } catch (error) {
            // Datei existiert nicht, erstelle sie
            await fs.writeFile(datenDateiPfad, '[]');
        }

        // Lese die Benutzerdaten
        const daten = await fs.readFile(datenDateiPfad, 'utf8');
        benutzer = JSON.parse(daten);
    } catch (error) {
        console.error('Fehler beim Verarbeiten der Benutzerdaten:', error);
        return NextResponse.json({ fehler: 'Interner Serverfehler' }, { status: 500 });
    }

    // Finde den Benutzer und vergleiche das Passwort
    const user = benutzer.find((benutzer: { email: string, passwort: string }) => benutzer.email === email);

    if (user && passwort == user.passwort) {
        return NextResponse.json({ nachricht: 'Login erfolgreich', benutzer: user }, { status: 200 });
    } else {
        return NextResponse.json({ fehler: 'Ungültige Anmeldedaten' }, { status: 401 });
    }
}
