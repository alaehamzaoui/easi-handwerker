"use client"
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../styles/signup.module.css';
import logo from "../../images/MiniMeister-Logo-white.png";
import Popup from '../../components/Popup';

export default function Anmeldung() {
    const [vorname, setVorname] = useState('');
    const [nachname, setNachname] = useState('');
    const [geburtsdatum, setGeburtsdatum] = useState('');
    const [kategorie, setKategorie] = useState('');
    const [straße, setStraße] = useState('');
    const [stadt, setStadt] = useState('');
    const [telefon, setTelefon] = useState('');
    const [email, setEmail] = useState('');
    const [passwort, setPasswort] = useState('');
    const [passwortWiederholen, setPasswortWiederholen] = useState('');
    const [stundenlohn, setStundenlohn] = useState('');
    const [popupNachricht, setPopupNachricht] = useState('');
    const [istPopupSichtbar, setIstPopupSichtbar] = useState(false);

    const berechneAlter = (geburtsdatum: string) => {
        const geburt = new Date(geburtsdatum);
        const heute = new Date();
        let alter = heute.getFullYear() - geburt.getFullYear();
        const monatsUnterschied = heute.getMonth() - geburt.getMonth();
        if (monatsUnterschied < 0 || (monatsUnterschied === 0 && heute.getDate() < geburt.getDate())) {
            alter--;
        }
        return alter;
    };
    
    const zeigePopup = (nachricht: string) => {
        setPopupNachricht(nachricht);
        setIstPopupSichtbar(true);
    };

    const schließePopup = () => {
        setIstPopupSichtbar(false);
    };

    const handleAbsenden = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if (!vorname || !nachname || !geburtsdatum || !kategorie || !straße || !stadt || !telefon || !email || !passwort || !passwortWiederholen || !stundenlohn) {
            zeigePopup('Bitte füllen Sie alle Felder aus');
            return;
        }
        if (berechneAlter(geburtsdatum) < 18 || berechneAlter(geburtsdatum) > 67) {
            zeigePopup('Das eingegebene Datum ist ungültig');
            return;
        }
        if (passwort !== passwortWiederholen) {
            zeigePopup('Die eingegebenen Passwörter stimmen nicht überein');
            return;
        }
        const emailRegel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegel.test(email)) {
            zeigePopup('Bitte geben Sie eine gültige Email-Adresse ein');
            return;
        }
        if (parseFloat(stundenlohn) < 12) {
            zeigePopup(`Der Stundenlohn muss mindestens ${12} € betragen.`);
            return;
        }

        const benutzerdaten = {
            vorname,
            nachname,
            geburtsdatum,
            kategorie,
            straße,
            stadt,
            telefon,
            email,
            passwort,
            stundenlohn
        };

        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(benutzerdaten),
        });

        if (response.ok) {
            zeigePopup('Ihre Registrierung war erfolgreich!');
        } else {
            zeigePopup('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
    };

    return (
        <div className={styles.mainContainer}>
            <Link href="/">
            <div className={styles.logoContainer}>
                <Image src={logo} alt="Logo" width={200} height={200} />
            </div>
            </Link>
            <div className={styles.container}>
                <h1 className={`${styles.title} text-black text-4xl mb-7 tracking-wider leading-none`}><strong>Registrierung</strong></h1>
                <form onSubmit={handleAbsenden} className={styles.form}>
                    <div className={styles.row}>
                        <input
                            type="text"
                            id="vorname"
                            value={vorname}
                            placeholder='Vorname'
                            onChange={(e) => setVorname(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            id="nachname"
                            value={nachname}
                            placeholder='Nachname'
                            onChange={(e) => setNachname(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="date"
                            id="geburtsdatum"
                            value={geburtsdatum}
                            placeholder='Geburtsdatum'
                            onChange={(e) => setGeburtsdatum(e.target.value)}
                            className={styles.input}
                        />
                        <select
                            id="kategorie"
                            value={kategorie}
                            onChange={(e) => setKategorie(e.target.value)}
                            className={styles.input}
                        >
                            <option value="">Art der Ausbildung</option>
                            <option value="Maurer/-in">Maurer/-in</option>
                            <option value="Dachdecker/-in">Dachdecker/-in</option>
                            <option value="Friseur/-in">Friseur/-in</option>
                            <option value="Elektriker/-in">Elektriker/-in</option>
                            <option value="Maler/-in">Maler/-in</option>

                            
                        </select>
                    </div>
                    <div className={styles.row}>
                        <input
                            type="text"
                            id="straße"
                            value={straße}
                            placeholder='Straße & Hausnummer'
                            onChange={(e) => setStraße(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            id="stadt"
                            value={stadt}
                            placeholder='Stadt'
                            onChange={(e) => setStadt(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="tel"
                            id="telefon"
                            value={telefon}
                            placeholder='Telefonnummer'
                            onChange={(e) => setTelefon(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="email"
                            id="email"
                            value={email}
                            placeholder='Email'
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="password"
                            id="passwort"
                            value={passwort}
                            placeholder='Passwort'
                            onChange={(e) => setPasswort(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="password"
                            id="passwortWiederholen"
                            value={passwortWiederholen}
                            placeholder='Passwort bestätigen'
                            onChange={(e) => setPasswortWiederholen(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="number"
                            id="stundendlohn"
                            value={stundenlohn}
                            placeholder='Stundenlohn'
                            onChange={(e) => setStundenlohn(e.target.value)}
                            className={styles.input}
                        />
                    </div>

                    <button type="submit" className={styles.button}>Registrieren</button>
                </form>
                <Link href="/login">
                    <p className={`${styles.registerText} text-black`}>Haben Sie schon ein Konto? <button className={styles.loginButton}><strong>Login</strong></button></p>
                </Link>
            </div>
            {istPopupSichtbar && <Popup message={popupNachricht} onClose={schließePopup} />}
        </div>
    );
}
