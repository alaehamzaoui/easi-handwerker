"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/login.module.css';
import logo from "../../images/MiniMeister-Logo-white.png";
import Popup from '../../components/Popup';

export default function Anmeldung() {
    const [sessionChecked, setSessionChecked] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (sessionStorage.getItem('token') && sessionStorage.getItem('email')) {
                window.location.href = '/dashboard';
            } else {
                setSessionChecked(true); 
            }
        }
    }, []);

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

        const response = await fetch('http://localhost:3005/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, passwort }),
        });

        if (response.ok) {
            const daten = await response.json();
            console.log('Login erfolgreich:', daten.email);
            zeigePopup('Login erfolgreich! Weiterleitung zum Dashboard...');
            sessionStorage.setItem('email', daten.email);
            sessionStorage.setItem('token', daten.token);
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            const fehlerDaten = await response.json();
            zeigePopup(`Login fehlgeschlagen: ${fehlerDaten.fehler}`);
        }
    };

    if (!sessionChecked) {
        return null; 
    }

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
                <Link href="/signup">
                    <p className={`${styles.registerText} text-black`}>kein Account? <button className={styles.registerButton}><strong>Registrierung</strong></button></p>
                </Link>
            </div>
            {istPopupSichtbar && <Popup message={popupNachricht} onClose={schließePopup} />}
        </div>
    );
}
