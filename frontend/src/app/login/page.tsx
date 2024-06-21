"use client"
import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css'; 
import logo from "../../images/MiniMeister-Logo-white.png"
export default function Login() {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const userDataString = localStorage.getItem(email);
    let userData;
    if (userDataString) {
      userData = JSON.parse(userDataString);
    }
    if (userData && userData.password === password) {
      alert('Login erfolreich!');
    } else {
      alert('Error: Benutzer nicht gefunden oder falsches Passwort');
    }
  };

  return (
    <div className={styles.mainContainer}>
      <div className={styles.logoContainer}>
        <Image src={logo} alt="Logo" width={200} height={200} />
      </div>
    <div className={styles.container}>
      <h1 className='${styles.title} text-black text-4xl mb-7 tracking-wider leading-none'><strong>Login</strong></h1>
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
      <p className='${styles.registerText} text-black'>kein Account ?  
        <Link href="/signup">
          <button className={styles.registerButton}><strong>Registrierung</strong></button>
        </Link>
      </p>
    </div>
    </div>
  );
}