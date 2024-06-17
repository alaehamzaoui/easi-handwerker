"use client"
import Link from 'next/link';
import { useState } from 'react';

export default function SignUp() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [birthDate, setBirthDate] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const userData = {
          firstName,
          lastName,
          birthDate,
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
      <div>
        <h1><strong>Registrierung</strong></h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="firstName"></label>
          <input
            type="text"
            id="firstName"
            value={firstName} placeholder='Vorname'
            onChange={(e) => setFirstName(e.target.value)}
          />
          <div><label htmlFor="lastName"></label>
          <input
            type="text"
            id="lastName"
            value={lastName} placeholder='Nachname'
            onChange={(e) => setLastName(e.target.value)}
          /></div>
          <div><label htmlFor="birthDate"></label>
          <input
            type="date"
            id="birthDate"
            value={birthDate} placeholder='Geburtsdatum'
            onChange={(e) => setBirthDate(e.target.value)}
          /></div>
          <div><label htmlFor="city"></label>
          <input
            type="text"
            id="city"
            value={city} placeholder='PLZ Stadt'
            onChange={(e) => setCity(e.target.value)}
          /></div>
          <div><label htmlFor="phone"></label>
          <input
            type="tel"
            id="phone"
            value={phone} placeholder='telefonnummer'
            onChange={(e) => setPhone(e.target.value)}
          /></div>
          <div><label htmlFor="email"></label>
          <input
            type="email"
            id="email"
            value={email} placeholder='Email'
            onChange={(e) => setEmail(e.target.value)}
          /></div>
          <div><label htmlFor="password"></label>
          <input
            type="password"
            id="password"
            value={password} placeholder='Passwort'
            onChange={(e) => setPassword(e.target.value)}
          /></div>
          <button type="submit">Registrieren</button>
        </form>
      <Link href="/login">
        <button><strong>Login</strong>
        </button>
      </Link>
    </div>
  );
}