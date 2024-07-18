"use client";
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../../styles/login.module.css';
import logo from "../../images/MiniMeister-Logo-white.png";
import Popup from '../../components/Popup';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);

    const showPopup = (message: string) => {
        setPopupMessage(message);
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Login erfolgreich:', data.user);
            showPopup('Login erfolgreich! Weiterleitung zum Dashboard...');
            sessionStorage.setItem('user', JSON.stringify(data.user));
            setTimeout(() => {
                window.location.href = '/dashboard';
            }, 2000);
        } else {
            const errorData = await response.json();
            showPopup(`Login fehlgeschlagen: ${errorData.error}`);
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
                <h1 className={`${styles.title} text-black text-4xl mb-7 tracking-wider leading-none`}><strong>Login</strong></h1>
                <form onSubmit={handleSubmit} className={styles.form}>
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
                            id="password"
                            value={password}
                            placeholder='Passwort'
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" className={styles.button}>Login</button>
                </form>
                <Link href="/signup">
                    <p className={`${styles.registerText} text-black`}>kein Account? <button className={styles.registerButton}><strong>Registrierung</strong></button></p>
                </Link>
            </div>
            {isPopupVisible && <Popup message={popupMessage} onClose={closePopup} />}
        </div>
    );
}
