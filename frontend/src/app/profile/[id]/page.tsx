"use client";
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from "../../../images/MiniMeister-Logo-white.png";
import styles from '../../../styles/profile.module.css';
import Popup from '../../../components/Popup';
import malerbild from "../../../images/maler.png";
import elektrikerbild from "../../../images/elektriker.png";
import mauererbild from "../../../images/mauerer.png";
import dachdeckerbild from "../../../images/dachdecker.png";
import friseurbild from "../../../images/friseur.png";



const handwerkerBilder = {
  "Maler/-in": malerbild,
  "Elektriker/-in": elektrikerbild,
  "Maurer/-in": mauererbild,
  "Dachdecker/-in": dachdeckerbild,
  "Friseur/-in": friseurbild,

};

// Funktion zur Auswahl des passenden Bildes basierend auf der Kategorie
const getBildForKategorie = (kategorie: string) => {
  // Kategorie in Kleinbuchstaben umwandeln und die letzten 3 Zeichen entfernen
  //const key = kategorie.toLowerCase().slice(0, -3);
  return handwerkerBilder[kategorie] || logo; // Fallback-Bild, wenn keine Kategorie passt
};
interface Arbeitszeit {
  tag: string;
  von: string;
  bis: string;
  gebucht : boolean
}

const ProfilDetails = () => {
  const router = useRouter();
  const { id } = useParams();

  const [handwerker, setHandwerker] = useState<any>(null);
  const [arbeitsZeiten, setArbeitsZeiten] = useState<Arbeitszeit[]>([]);
  const [vorhandeneBuchungen, setVorhandeneBuchungen] = useState<Arbeitszeit[]>([]);
  const [popupNachricht, setPopupNachricht] = useState('');
  const [istPopupSichtbar, setIstPopupSichtbar] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const istZeitSlotReserviert = (tag: string, von: string, bis: string) => {
    return vorhandeneBuchungen.some(
      buchung => buchung.tag === tag && buchung.von === von && buchung.bis === bis
    );
  };

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8080/handwerker/${id}`)
        .then(response => {
          if (!response.ok) {
          }
          return response.json();
        })
        .then(data => {
          setHandwerker(data.handwerker);
          
          setArbeitsZeiten(data.workTimes);
        })
        .catch(error => console.error('Fehler beim Abrufen der Handwerker-Details:', error));
    }
  }, [id]);

  const getNaechsteWoche = () => {
    const heute = new Date();
    const naechsteZweiWochen = [];
    for (let i = 0; i < 7; i++) {
      const datum = new Date(heute);
      datum.setDate(heute.getDate() + i);
      naechsteZweiWochen.push(datum);
    }
    return naechsteZweiWochen;
  };

  const getTagName = (datum: Date) => {
    return datum.toLocaleDateString('de-DE', { weekday: 'long' });
  };

  const zeigePopup = (nachricht: string) => {
    setPopupNachricht(nachricht);
    setIstPopupSichtbar(true);
  };

  const schließePopup = () => {
    setIstPopupSichtbar(false);
  };

  const handleClick = (tagName: string, datum: Date, von: string, bis: string) => {
   // alert(tagName + ' ' + datum + ' ' + von + ' ' + bis);
    setAusgewählterTag(`${tagName}, ${datum.toLocaleDateString('de-DE')}`);
    setStartZeit(von);
    setEndZeit(bis);
    setIsOpen(true);
  };
  interface Kundendaten {
    user_id: number;
    name: string;
    straßehausnummer: string;
    stadt_plz: string;
    email: string;
    telefon: string;
    anliegen: string;
    ausgewählter_tag: string;
    start_zeit: string;
    end_zeit: string;
  }
  

const buchen = async (e: React.FormEvent ) => {
    e.preventDefault();

    if (!name || !straßehausnummer || !stadtPLZ || !email || !tel || !anliegen) {
      zeigePopup('Bitte füllen Sie alle Felder aus');
      return;
    }


    const emailRegel = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegel.test(email)) {
      zeigePopup('Bitte geben Sie eine gültige Email-Adresse ein');
      return;
    }
    const userId =  Array.isArray(id) ? id[0] : id;

    const kundendaten: Kundendaten = {
    user_id : parseInt(userId as string, 10),
    name,
    straßehausnummer,
    stadt_plz : stadtPLZ,
    email,
    telefon,
    anliegen,
    ausgewählter_tag : ausgewählterTag,
    start_zeit : startZeit,
    end_zeit : endZeit
    };

    console.log("Kundendaten:", kundendaten); 

    try {
      const response = await fetch('http://localhost:8080/api/auftrag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(kundendaten),
      });
      
      if (response.ok) {
        try {
          const slicedAusgewählterTag = ausgewählterTag.slice(0,-10)
          

          //const formattedTag = ausgewählterTag.replace(/,\s*/g, '').replace(/\s+/g, '');
         
const isAlphaOrSpace = char => ((char.toLowerCase() !==
char.toUpperCase()) || char === ' ');
const removeSpecials = (slicedAusgewählterTag = '') => {
   let res = '';
   const { length: len } = slicedAusgewählterTag;
   for(let i = 0; i < len; i++){
      const el = slicedAusgewählterTag[i];
      if(isAlphaOrSpace(el)){
         res += el;
      };
   };
   return res;
};
const res = removeSpecials(slicedAusgewählterTag)
//alert(res)
          const response2 = await fetch(`http://localhost:8080/gebucht/${id}/${res}`, {
            method: 'POST',
          });
          
        } catch (error) {
          console.error('Fehler beim update:', error);
          
        }
        zeigePopup('Ihre Buchung wurde erfolgreich durchgeführt');
         setTimeout(() => {
          setIsOpen(false);
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await response.json();
        console.error("Fehler beim Speichern des Auftrags:", errorData);
        zeigePopup('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
      
    } catch (error) {
        console.error('Fehler beim Senden der Anfrage:', error);
        zeigePopup('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
    }
};

  const [ausgewählterTag, setAusgewählterTag] = useState('');
  const [startZeit, setStartZeit] = useState('');
  const [endZeit, setEndZeit] = useState('');
  const [name, setName] = useState('');
  const [straßehausnummer, setStraßeHausnummer] = useState('');
  const [stadtPLZ, setStadtPLZ] = useState('');
  const [email, setEmail] = useState('');
  const [tel, setTel] = useState('');
  const [anliegen, setAnliegen] = useState('');

  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)'
    },
    content: {
      height: '50%',
      width: '100%',
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      position: 'relative'
    }
  };

  if (!handwerker) {
    return <div>loading ..</div>;
  }

  const { vorname, nachname, stadt, kategorie, telefon, stundenlohn, bild } = handwerker;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-yellow-500 text-gray-800 p-4 flex items-center relative" style={{ height: '100px' }}>
        <div className="absolute left-0 top-0 bg-black h-full p-4 flex items-center cursor-pointer" onClick={() => router.push('/')}>
          <Image src={logo} alt="Logo" width={100} height={100} />
        </div>
      </header>
      <main className="flex-grow bg-gray-100 text-gray-800 p-8 flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-12 text-center tracking-wider drop-shadow-lg">Buchen Sie jetzt Ihren Handwerker</h1>
        <div className="flex flex-row w-full max-w-4xl bg-white p-8 rounded-lg shadow-2xl">
          <div className="flex-1 mr-8">
            <h2 className="text-2xl font-bold mb-4">Verfügbare Arbeitszeiten</h2>
            {istPopupSichtbar && <Popup message={popupNachricht} onClose={schließePopup} />}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {getNaechsteWoche().map((datum, index) => {
                const tagName = getTagName(datum);
                const arbeitsZeit = arbeitsZeiten.find(az => az.tag === tagName);
                if (!arbeitsZeit || !arbeitsZeit.von || !arbeitsZeit.bis || arbeitsZeit.gebucht) return null;
                if (istZeitSlotReserviert(`${tagName}, ${datum.toLocaleDateString('de-DE')}`, arbeitsZeit.von, arbeitsZeit.bis)) {
                  return null;
                }
                return (
                  <div key={index} className="react-modals">
                    <button
                      onClick={() => handleClick(tagName, datum, arbeitsZeit.von, arbeitsZeit.bis)}
                      className="border border-gray-300 p-4 rounded-lg shadow-sm bg-green-200 hover:bg-green-300 transition-colors"
                    >
                      <p className="text-lg font-semibold">{tagName}, {datum.toLocaleDateString('de-DE')}</p>
                      <p className="text-gray-600">{arbeitsZeit.von} - {arbeitsZeit.bis}</p>
                    </button>
                    {isOpen && 
                      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                        <div className="p-8 border w-96 shadow-lg rounded-md bg-white" style={{ position: 'relative' }}>
                          {/* Schließen-Button oben rechts */}
                          <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-2 right-2 text-red-600 hover:text-red-800 font-bold text-xl"
                          >
                            &times;
                          </button>
                          <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900">Bitte Ihre Daten eingeben</h3>
                            <div className="mt-2 px-7 py-3">
                              <p className="text-lg text-gray-500"> 
                                <div className={styles.row}>
                                  <input
                                    type="text"
                                    id="name"
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                  />
                                </div>
                                <div className={styles.row}>
                                  <input
                                    type="text"
                                    id="straße"
                                    placeholder='Straße & Hausnummer'
                                    value={straßehausnummer}
                                    onChange={(e) => setStraßeHausnummer(e.target.value)}
                                    className={styles.input}
                                  />
                                </div>
                                <div className={styles.row}>
                                  <input
                                    type="text"
                                    id="stadt"
                                    placeholder='PLZ & Stadt'
                                    value={stadtPLZ}
                                    onChange={(e) => setStadtPLZ(e.target.value)}
                                    className={styles.input}
                                  />
                                </div>
                                <div className={styles.row}>
                                  <input
                                    type="number"
                                    id="telefon"
                                    placeholder='Telefonnummer'
                                    value={tel}
                                    onChange={(e) => setTel(e.target.value)}
                                    className={styles.input}
                                  />
                                </div>
                                <div className={styles.row}>
                                  <input
                                    type="email"
                                    id="email"
                                    placeholder='E-Mail'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={styles.input}
                                  />
                                </div>
                                <div className={styles.row}>
                                  <input
                                    type="text"
                                    id="anliegen"
                                    placeholder='Anliegen/Problem'
                                    value={anliegen}
                                    onChange={(e) => setAnliegen(e.target.value)}
                                    className={styles.input}
                                  />
                                </div>
                              </p>
                            </div>
                            <div className="flex justify-center mt-4">
                              <button
                               
                                onClick={(e) => buchen(e)}
                                className={styles.button}
                              >
                           Buchen
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex-1 flex flex-col items-center">
            <img src={bild} width={128} height={128} alt={`${vorname} ${nachname}`} className="w-32 h-32 rounded-full mb-4" />
            <h1 className="text-3xl font-bold">{`${vorname} ${nachname}`}</h1>
            <p className="text-gray-600 mb-4">{kategorie}</p>
            <div className="space-y-4">
              <p className="text-lg"><strong className="text-yellow-500">Stadt:</strong> {stadt}</p>
              <p className="text-lg"><strong className="text-yellow-500">Kategorie:</strong> {kategorie}</p>
              <p className="text-lg"><strong className="text-yellow-500">Telefonnummer:</strong> {telefon}</p>
              <p className="text-lg"><strong className="text-yellow-500">Stundenlohn:</strong> {stundenlohn}€</p>
            </div>
          </div>
        </div>
      </main>
      <footer className="bg-yellow-500 text-gray-800 p-4 flex justify-center items-center">
        <p>© 2024 MiniMeister. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
};

export default ProfilDetails;