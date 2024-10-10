"use client";

import { FaHeadset, FaBalanceScale, FaClock } from 'react-icons/fa';
import styles from '@/styles/FeaturesKomponent.module.css';

export default function FeaturesKomponent() {
  return (
    <div className={styles.featuresContainer}>
      <div className={styles.featuresGrid}>
        <div className={styles.featureItem}>
          <FaHeadset className={styles.icon} />
          <p>Kundenservice</p>
          <p className={styles.hideOnMobile}>Unser Team steht Ihnen jederzeit zur Verfügung.</p>
        </div>
        <div className={styles.featureItem}>
          <FaBalanceScale className={styles.icon} />
          <p>Faire Preise</p>
          <p className={styles.hideOnMobile}>Transparente Preise, die Ihre Erwartungen übertreffen.</p>
        </div>
        <div className={styles.featureItem}>
          <FaClock className={styles.icon} />
          <p>Flexibilität</p>
          <p className={styles.hideOnMobile}>Wir passen uns Ihrem Zeitplan an.</p>
        </div>
      </div>
    </div>
  );
}
