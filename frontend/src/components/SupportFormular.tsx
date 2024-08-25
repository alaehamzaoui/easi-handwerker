// components/SupportFormular.tsx
"use client";

import { useState } from 'react';

const SupportFormular = () => {
    const [nachricht, setNachricht] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Support-Anfrage gesendet:', nachricht);
        setNachricht('');
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col">
            <textarea
                value={nachricht}
                onChange={(e) => setNachricht(e.target.value)}
                placeholder="Ihre Nachricht..."
                className="p-2 border rounded mb-4"
            />
            <button type="submit" className="px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-400 transition">
                Nachricht senden
            </button>
        </form>
    );
};

export default SupportFormular;
