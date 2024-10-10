// pages/index.tsx
import Head from 'next/head';
import Slider from '@/components/Slider';
import GridSection from '@/components/GridSection';
import StyledParagraph from '@/components/StyledParagraph';
import mini from "../images/Mini.png";
import meister from "../images/Meister.png";
import handw from "../images/handw.png";
import styles from '../styles/Home.module.css';
import FeaturesKomponent from '@/components/FeaturesKomponent';
import AdvantagesSection from '@/components/AdvantagesSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>My Landing Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <Slider />
      <AdvantagesSection/>
      <FeaturesKomponent />

      <div className={styles.headerContainer}>
      <div className={styles.banner}>
            <div className={styles.product}>
              <div className={styles.soda} />
              </div>
              <div className={styles.handwerker}>
              <img src={handw.src} alt="handwerker" />
            </div>
            <div className={styles.rock}>
              <img src={mini.src} alt="rock" />
             
              <img src={meister.src} alt="rock" />
            </div>
              </div>

</div>

      <StyledParagraph />
     

      <footer style={{ padding: '20px', textAlign: 'center', backgroundColor: '#333', color: '#fff' }}>
        &copy; 2024 Curva sud.
      </footer>
    </>
  );
}
