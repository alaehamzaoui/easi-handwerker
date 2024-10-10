"use client"; // Markiere die Komponente als Client-Komponente

import { FaCouch, FaDollarSign, FaRocket } from 'react-icons/fa'; // Icons aus react-icons
import styles from '@/styles/FeaturesKomponent.module.css'; // Importiere das CSS

export default function FeaturesKomponent() {
  return (
    <div className={styles.featuresContainer}>
      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <FaCouch className={styles.icon} /> {/* Icon für "Bequem" */}
          <p>Bequem</p>
          <p>Erleben Sie Komfort bei jedem Schritt.</p>
        </div>
        <div className={styles.featureItem}>
          <FaDollarSign className={styles.icon} /> {/* Icon für "Optimaler Preis" */}
          <p>Optimaler Preis</p>
          <p>Beste Preis-Leistung, auf die Sie sich verlassen können.</p>
        </div>
        <div className={styles.featureItem}>
          <FaRocket className={styles.icon} /> {/* Icon für "Schnell" */}
          <p>Schnell</p>
          <p>Schnell und effizient, ohne Kompromisse bei der Qualität.</p>
        </div>
      </div>
    </div>
  );
}
