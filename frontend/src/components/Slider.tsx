"use client"; // Mark the component as a Client Component

import { useState, useEffect } from 'react';
import styles from '@/styles/Slider.module.css';
import logo from '@/images/MiniMeister-Logo-white.png';

export default function Slider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [IstHovered, setIstHovered] = useState(false);
  const slideCount = 2; // Total number of slides

  useEffect(() => {
    if (!IstHovered) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slideCount);
      }, 2500); // Change slide every 2.5 seconds

      return () => clearInterval(interval); // Cleanup interval on unmount
    }
  }, [IstHovered]);

  const slides = [
    {
      title: "Als Azubi Anmelden",
      description: "Freizeite angeben um Aufträge in Ihre Nähe zu bekommen",
      buttonText: "Registeri",
      buttonLink: "/login",
    },
    {
      title: "Als Kunde Suchen",
      description: "Azubi Handwerker in Ihre Nähe suchen für Felxibler und gunstger Reparature",
      buttonText: "3bad",
      buttonLink: "/Suche",
    },
  ];

  const handleSlideChange = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <div className={styles.slider}>
      <div
        className={styles.slides}
        style={{ transform: `translateX(-${activeSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className={styles.slide}>
            <img src={logo.src} alt="Mini Meister" className={styles.logo} />
            <div   onMouseEnter={() => setIstHovered(true)}   // Stop the slide on hover
              onMouseLeave={() => setIstHovered(false)}  >
            <h2
              onMouseEnter={() => setIstHovered(true)}   // Stop the slide on hover
              onMouseLeave={() => setIstHovered(false)} >{slide.title}</h2>
            <p
              onMouseEnter={() => setIstHovered(true)}   // Stop the slide on hover
              onMouseLeave={() => setIstHovered(false)} >{slide.description}</p>

            </div>
            <a
              href={slide.buttonLink}
              className={styles.button}
              onMouseEnter={() => setIstHovered(true)}   // Stop the slide on hover
              onMouseLeave={() => setIstHovered(false)}  // Resume the slide on leave
            >
              {slide.buttonText}
            </a>
          </div>
        ))}
      </div>
      <div className={styles.controls}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={index === activeSlide ? styles.active : ''}
            onClick={() => handleSlideChange(index)}
          ></button>
        ))}
      </div>
    </div>
  );
}
