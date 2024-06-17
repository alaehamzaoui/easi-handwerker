import Image from "next/image";
import Head from "next/head";
import Link from "next/link"; // Importiere Link aus next/link
import Layout from "./layout";
import styles from "../styles/Home.module.css";
import Feature from "../components/Feature";
import logo from "../images/MiniMeister-Logo-white.png";
import background from "../images/hintergrundbildschwarzgelb.png";
import icon1 from "../images/BenutzerfreundlicheIcon.png";
import icon2 from "../images/ModernesDesignIcon.png";
import icon3 from "../images/KostenübersichtIcon.png";
import icon4 from "../images/VerfügbarkeitskalenderIcon.png";
import easiLogo from "../images/firmenLogo_EASI (1).png"; // Importiere das Logo-Bild
import React from "react";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>MiniMeister</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.backgroundImageContainer}>
          <Image
            src={background}
            alt="Background Foto"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
          />
        </div>

        <div className={styles.logoContainer}>
          <Image src={logo} alt="MiniMeister Logo" width={200} height={200} />
        </div>
        <div className={styles.registerContainer}>
          <button className={styles.buttonregister}>Auftrag einstellen</button>
          <button className={styles.buttonregister}>Als Azubi anmelden</button>
        </div>
        <div className={styles.sloganContainer}>
          <h1>Handwerkliche Lösungen für Ihren Alltag</h1>
        </div>

        <div className={styles.buttonContainer}>
          {/* Verwende Link-Komponente für die Navigation */}
          <Link href="/login" className={styles.button}>
            AZUBI
          </Link>
          <Link href="/search" className={styles.button}>
            KUNDE
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <h3>Was bieten wir an?</h3>
        <div className={styles.features}>
          <Feature imgSrc={icon1} title="Benutzerfreundliche Suche" />
          <Feature imgSrc={icon2} title="Modernes Design" />
          <Feature imgSrc={icon3} title="Kostenübersicht" />
          <Feature imgSrc={icon4} title="Verfügbarkeitskalender" />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <h2>Willkommen bei 'MiniMeister'!</h2>
          <p>
            Wir verstehen die Herausforderungen, wenn es um kleine
            Reparaturprojekte in Ihrer Wohnung geht. Die Suche nach bezahlbaren
            Handwerkern kann schwierig sein, besonders wenn die großen
            Meisterbetriebe zu teuer sind und das Ausbildungsgehalt begrenzt
            ist. Mit 'MiniMeister' haben Sie die Lösung gefunden.
            Unsere Webplattform vermittelt Handwerker-Azubis für einfache,
            schnelle und kostengünstige Projekte direkt in Ihrer Nähe. Durch die
            Nutzung von Internetrecherche finden Sie schnell verfügbare Azubis,
            die auch während des Wochenendes arbeiten können.
            Mit 'MiniMeister' finden Sie nicht nur schnelle Lösungen für Ihre
            Reparaturen, sondern unterstützen auch die nächste Generation von
            Handwerkern auf Ihrem Weg zur Meisterschaft. Besuchen Sie heute
            noch unsere Plattform und entdecken Sie die Vorteile!
          </p>
          <div className={styles.footerBottom}>
            <div className={styles.footerLeft}>
              <div className={styles.footerAddress}>
                <p className={styles.footerHeading}>Adresse</p>
                <p>Am Hochschulcampus 1</p>
                <p>44801 Bochum</p>
              </div>
              <div className={styles.footerSocial}>
                <p className={styles.footerHeading}>Social Media</p>
                <p>Instagram</p>
              </div>
            </div>
            <div className={styles.footerLogo}>
              <Image src={easiLogo} alt="EASI Logo" width={100} height={50} />
            </div>
          </div>
        </div>
      </footer>
    </Layout>
  );
}
