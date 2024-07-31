import Image from 'next/image';
import styles from '../styles/Feature.module.css';
import React from 'react';

interface FeatureProps {
  imgSrc: string;
  title: string;
}

const Feature: React.FC<FeatureProps> = ({ imgSrc, title }) => {
  return (
    <div className={styles.feature}>
      <Image src={imgSrc} alt={title} width={250} height={250} />
      <h3>{title}</h3>
    </div>
  );
}

export default Feature;
