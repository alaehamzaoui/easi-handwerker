"use client"
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../styles/signup.module.css';
import logo from "../../images/MiniMeister-Logo-white.png";
import Popup from '../../components/Popup';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [category, setCategory] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordAgain, setPasswordAgain] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userDataString = localStorage.getItem('user');
        if (userDataString) {
            window.location.href ='../dashboard';
        } else {
            setIsLoading(false);
        }
    }, []);

    const showPopup = (message: string) => {
        setPopupMessage(message);
        setIsPopupVisible(true);
    };

    const closePopup = () => {
        setIsPopupVisible(false);
    };

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        //überprüft, dass es keine Lücke gibt
        if (!firstName || !lastName || !birthDate || !category || !street || !city || !phone || !email || !password || !passwordAgain) {
            showPopup('Bitte füllen Sie alle Felder aus');
            return;
        }
        //überprüft ob die Passwörter gleich sind
        if (password !== passwordAgain) {
            showPopup('die eingegebenen Passwörter übereinstimmen nicht');
            return;
        }
        //überprüft die Richtigkeit der Email-Adresse
        const emailRegel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegel.test(email)) {
            showPopup('Bitte geben Sie eine gültige Email-Adresse');
            return;
        }
        const userData = {
            firstName,
            lastName,
            birthDate,
            category,
            city,
            phone,
            email,
            password,
            passwordAgain
        };
        localStorage.setItem('user', JSON.stringify(userData));
        showPopup('Ihre Registrierung war erfolgreich!');
        setTimeout(() => {
            window.location.href =('../dashboard');
        }, 2000);
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
                <h1 className={`${styles.title} text-black text-4xl mb-7 tracking-wider leading-none`}><strong>Registrierung</strong></h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.row}>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            placeholder='Vorname'
                            onChange={(e) => setFirstName(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            placeholder='Nachname'
                            onChange={(e) => setLastName(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="date"
                            id="birthDate"
                            value={birthDate}
                            placeholder='Geburtsdatum'
                            onChange={(e) => setBirthDate(e.target.value)}
                            className={styles.input}
                        />
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={styles.input}
                        >
                            <option value="">Art der Ausbildung</option>
                            <option value="Maurer/-in">Maurer/-in</option>
                            <option value="Zimmerer/Zimmerin">Zimmerer/Zimmerin</option>
                            <option value="Dachdecker/-in">Dachdecker/-in</option>
                            <option value="Friseur/-in">Friseur/-in</option>
                            <option value="Kosmetiker/-in">Kosmetiker/-in</option>
                        </select>
                    </div>
                    <div className={styles.row}>
                        <input
                            type="text"
                            id="street"
                            value={street}
                            placeholder='Straße & Hausnummer'
                            onChange={(e) => setStreet(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="text"
                            id="city"
                            value={city}
                            placeholder='PLZ Stadt'
                            onChange={(e) => setCity(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.row}>
                        <input
                            type="tel"
                            id="phone"
                            value={phone}
                            placeholder='Telefonnummer'
                            onChange={(e) => setPhone(e.target.value)}
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
                            id="password"
                            value={password}
                            placeholder='Passwort'
                            onChange={(e) => setPassword(e.target.value)}
                            className={styles.input}
                        />
                        <input
                            type="password"
                            id="passwordAgain"
                            value={passwordAgain}
                            placeholder='Passwort bestätigen'
                            onChange={(e) => setPasswordAgain(e.target.value)}
                            className={styles.input}
                        />
                    </div>
                    <button type="submit" className={styles.button}>Registrieren</button>
                </form>
                <Link href="/login">
                    <p className={`${styles.registerText} text-black`}>Haben Sie schon ein Account? <button className={styles.loginButton}><strong>Login</strong></button></p>
                </Link>
            </div>
            {isPopupVisible && <Popup message={popupMessage} onClose={closePopup} />}
        </div>
    );
}
