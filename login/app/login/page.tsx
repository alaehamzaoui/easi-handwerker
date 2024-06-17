"use client"
import Link from 'next/link';
import { useState } from 'react';

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
    <div>
      <h1><strong>Login</strong></h1>
      <form onSubmit={handleLogin}>
        <div>
            <input type='text' name="password" placeholder='Email' value={email}
            onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div>
            <input type='text' name="password" placeholder='Passwort' value={password}
            onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type='submit'>Login</button> 
        </form>
        <p>kein Account ?  <Link href="/signup"><button><strong>Registrierung</strong></button>
      </Link> </p>
      
    </div>
  );
}