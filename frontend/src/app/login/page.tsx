"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/login.module.css';
import logo from "../../images/MiniMeister-Logo-white.png";
import Popup from '../../components/Popup';
import hintergrund from "../../images/hintergrund.webp";  // Import des Hintergrundbildes

export default function Anmeldung() {
    const [email, setEmail] = useState('');
    const [passwort, setPasswort] = useState('');
    const [popupNachricht, setPopupNachricht] = useState('');
    const [istPopupSichtbar, setIstPopupSichtbar] = useState(false);

    const zeigePopup = (nachricht: string) => {
        setPopupNachricht(nachricht);
        setIstPopupSichtbar(true);
    };

    const schließePopup = () => {
        setIstPopupSichtbar(false);
    };
    const handleAbsenden = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        if ( email === 'admin@hs-bochum.de' || passwort === 'rootroot' ) {
            sessionStorage.setItem('isadmin', JSON.stringify({ email: email }));
            window.location.href = '/admin';
            return;
        }

        const response = await fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, passwort }),
        });
    
        if (response.ok) {
            const daten = await response.json();
            console.log('Login erfolgreich:', daten.benutzer);
            zeigePopup('Login erfolgreich! Weiterleitung zum Dashboard...');
            
            // JWT-Token im localStorage speichern
            sessionStorage.setItem('token', daten.token);
            sessionStorage.setItem('benutzer', JSON.stringify(daten.benutzer));
            
            //alert(daten.benutzer.verified);
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            const fehlerDaten = await response.json();
            zeigePopup(`Login fehlgeschlagen: ${fehlerDaten.error}`);
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
                <h1 className={`${styles.title} text-black text-4xl mb-7 tracking-wider leading-none`}><strong>Anmeldung</strong></h1>
                <form onSubmit={handleAbsenden} className={styles.form}>
                    <div className={styles.row}>
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
                    </div>
                    <button type="submit" className={styles.button}>Anmeldung</button>
                </form>
                <Link href="/registrierung">
                    <p className={`${styles.registerText} text-black`}>kein Account? <button className={styles.registerButton}><strong>Registrierung</strong></button></p>
                </Link>
            </div>
            {istPopupSichtbar && <Popup message={popupNachricht} onClose={schließePopup} />}
        </div>
    );
}
