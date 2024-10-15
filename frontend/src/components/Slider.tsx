"use client"; 

import { useState, useEffect } from 'react';
import styles from '@/styles/Slider.module.css';
import logo from '@/images/MiniMeister-Logo-white.png';

export default function Slider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [IstHovered, setIstHovered] = useState(false);
  const slideCount = 2; 

  useEffect(() => {
    if (!IstHovered) {
      const interval = setInterval(() => {
        setActiveSlide((prev) => (prev + 1) % slideCount);
      }, 2500); 

      return () => clearInterval(interval); 
    }
  }, [IstHovered]);

  const slides = [
    {
      title: "Als Azubi-Handwerker registrieren",
      description: "Geben Sie Ihre Verfügbarkeit an, um Aufträge in Ihrer Nähe zu erhalten.",
      buttonText: "Anmelden",
      buttonLink: "/login",
    },
    {
      title: "Als Kunde suchen",
      description: "Finden Sie Azubi-Handwerker in Ihrer Nähe für flexible und kostengünstige Reparaturen.",
      buttonText: "Suchen",
      buttonLink: "/Suche",
    }
    ,
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

            <img  src={logo.src} alt="Mini Meister" className={styles.logo}  />
            
                <div className={styles.block}   onMouseEnter={() => setIstHovered(true)}   
              onMouseLeave={() => setIstHovered(false)}  >
            <h2
              onMouseEnter={() => setIstHovered(true)}   
              onMouseLeave={() => setIstHovered(false)} >{slide.title}</h2>
            <p className={styles.description}
              onMouseEnter={() => setIstHovered(true)}  
              onMouseLeave={() => setIstHovered(false)} >{slide.description}</p>

            </div>
            <a
              href={slide.buttonLink}
              className={styles.button}
              onMouseEnter={() => setIstHovered(true)}   
              onMouseLeave={() => setIstHovered(false)}  
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
