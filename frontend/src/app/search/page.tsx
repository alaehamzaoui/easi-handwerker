"use client"
import Image from "next/image";
import { useState } from 'react';
import handwerkerData from "../data/data.js";
import React from "react";
export default function Home() {
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const filteredHandwerker = handwerkerData.filter(handwerker =>
    (category === '' || handwerker.categorie.toLowerCase().includes(category.toLowerCase())) &&
    (city === '' || handwerker.stadt.toLowerCase().includes(city.toLowerCase()))
  );
  return (
    <div style={{ marginLeft : '20%'}}>
      <h1>Handwerker Search Page</h1>
      <div>
        <input
          type="text"
          placeholder="Search by category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by city"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />
      </div>
        <div>
          {filteredHandwerker.map((handwerker, index) => (
            <div key={index} style={{ border: 'solid', marginTop : '3%', width : '60%',paddingLeft : '2%' }}>
              <p>Vorname: {handwerker.vorname}</p>
              <p>Nachname: {handwerker.nachname}</p>
              <p>Stadt: {handwerker.stadt}</p>
              <p>Categorie: {handwerker.categorie}</p>
              <p>Telefonnummer: {handwerker.telefonnummer}</p>
            </div>
          ))}
        </div>
    </div>
  );
}
