"use client"
import Link from 'next/link';
import { useState } from 'react';
import styles from './page.module.css';

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

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const userData = {
          firstName,
          lastName,
          birthDate,
          category,
          city,
          phone,
          email,
          password
        };
        //Speicherung von data in localStorage
        localStorage.setItem(email, JSON.stringify(userData));
        alert('Ihre Registrierung war erfolgreich!');
      };
  
    return (
      <div className={styles.mainContainer}>
      <div className={styles.container}>
        <h1 className={styles.title}><strong>Registrierung</strong></h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName"></label>
          <input
            type="text"
            id="firstName"
            value={firstName} placeholder='Vorname'
            onChange={(e) => setFirstName(e.target.value)} className={styles.input}
          />
          <div><label htmlFor="lastName"></label>
          <input
            type="text"
            id="lastName"
            value={lastName} placeholder='Nachname'
            onChange={(e) => setLastName(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="birthDate"></label>
          <input
            type="text"
            id="birthDate"
            value={birthDate} placeholder='Geburtsdatum'
            onChange={(e) => setBirthDate(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="category"></label>
          <input
            type="text"
            id="category"
            value={category} placeholder='Art der Ausbildung'
            onChange={(e) => setCategory(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="street"></label>
          <input
            type="text"
            id="street"
            value={street} placeholder='Straße & Hausnummer'
            onChange={(e) => setStreet(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="city"></label>
          <input
            type="text"
            id="city"
            value={city} placeholder='PLZ Stadt'
            onChange={(e) => setCity(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="phone"></label>
          <input
            type="tel"
            id="phone"
            value={phone} placeholder='telefonnummer'
            onChange={(e) => setPhone(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="email"></label>
          <input
            type="email"
            id="email"
            value={email} placeholder='Email'
            onChange={(e) => setEmail(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            value={password} placeholder='Passwort'
            onChange={(e) => setPassword(e.target.value)} className={styles.input}
          /></div>
          <div><label htmlFor="passwordAgain"></label>
          <input
            type="password"
            id="passwordAgain"
            value={passwordAgain} placeholder='Passwort bestätigen'
            onChange={(e) => setPasswordAgain(e.target.value)} className={styles.input}
          /></div>
          <button type="submit" className={styles.button}>Registrieren</button>
        </form>
      <Link href="/login">
        <p className={styles.registerText}>schon ein Account? <button className={styles.loginButton}><strong>Login</strong>
        </button></p>
      </Link>
    </div>
    </div>
  );
}