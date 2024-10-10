"use client"; // Markiere die Komponente als Client-Komponente

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import styles from '@/styles/AdvantagesSection.module.css';
import FeaturesKomponent from './FeaturesKomponent'; // Importiere die FeaturesKomponent

export default function AdvantagesSection() {
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasRef.current.appendChild(renderer.domElement);

    const cubes = [];
    const material = new THREE.MeshBasicMaterial({
      color: 0xffcc00, // Gelbe Farbe
      transparent: true,
      opacity: 0.5, // Halb-transparent
    });

    for (let i = 0; i < 700; i++) {
      const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3); // Kleinere Würfel
      const cube = new THREE.Mesh(geometry, material);

      // Zufällige Positionen innerhalb eines größeren Bereichs, um sie weiter zu verteilen
      cube.position.set(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      );

      cubes.push(cube);
      scene.add(cube);
    }

    camera.position.z = 3; // Kamera zurücksetzen, um alle Würfel zu sehen

    const animate = () => {
      requestAnimationFrame(animate);

      // Rotieren der Würfel
      cubes.forEach((cube) => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      });

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.dispose(); // Renderer nach dem Unmount bereinigen
      canvasRef.current.removeChild(renderer.domElement); // Entferne das Canvas-Element
    };
  }, []);

  return (
    <div className={styles.advantagesContainer}>
      <div ref={canvasRef} className={styles.canvas}></div>
      <div className={styles.advantagesShape}>

        <h2>Alo ?</h2>
        <p>
          Lorum Ispum nch ka kaskas do msüda
        </p>
      </div>
    </div>
  );
}
