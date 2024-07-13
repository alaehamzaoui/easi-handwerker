"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/login.module.css';
import logo from "../../images/MiniMeister-Logo-white.png";
import Popup from '../../components/Popup';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            window.location.href = "../dashboard";
        } else {
            setIsLoading(false); 
        }
    }, []);

    useEffect(() => {
        if (shouldRedirect) {
            window.location.href = "../dashboard";
        }
    }, [shouldRedirect]);

    const showPopup = (message: string) => {
        setPopupMessage(message);
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
        if (popupMessage === 'Login erfolgreich!') {
            setShouldRedirect(true);
        }
    };

    const handleLogin = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const userDataString = localStorage.getItem(email);
        let userData;
        if (userDataString) {
            userData = JSON.parse(userDataString);
        }
        if (userData && userData.password === password) {
            showPopup('Login erfolgreich!');
        } else {
            showPopup('Error: Benutzer nicht gefunden oder falsches Passwort');
        }
    };

    if (isLoading) {
        return null; 
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.logoContainer}>
                <Image src={logo} alt="Logo" width={200} height={200} />
            </div>
            <div className={styles.container}>
                <h1 className={`${styles.title} text-black text-4xl mb-7 tracking-wider leading-none`}><strong>Login</strong></h1>
                <form onSubmit={handleLogin} className={styles.form}>
                    <div>
                        <input
                            type='text'
                            name="email"
                            placeholder='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div>
                        <input
                            type='password'
                            name="password"
                            placeholder='Passwort'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <button type='submit' className={styles.button}>Login</button>
                </form>
                <p className={`${styles.registerText} text-black`}>kein Account ?
                    <Link href="/signup">
                        <button className={styles.registerButton}><strong>Registrierung</strong></button>
                    </Link>
                </p>
            </div>
            {isPopupVisible && <Popup message={popupMessage} onClose={closePopup} />}
        </div>
    );
}
