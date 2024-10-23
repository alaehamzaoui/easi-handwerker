'use client';

import { useState, useEffect } from "react";
import {
  FaUser,
  FaLifeRing,
  FaCheckCircle,
  FaSignOutAlt,
  FaArrowLeft,
  FaStar,
} from "react-icons/fa";
import Link from "next/link"; // Verwende Link-Komponente für Navigation
import Popup from "../../components/Popup";
import PersoenlicheDatenModal from "../../components/PersoenlicheDatenModal";
import BestaetigungsModal from "../../components/BestaetigungModal";

interface Auftrag {
  id: number;
  user_id: number;
  name: string;
  ausgewählter_tag: string;
  straßehausnummer: string;
  stadt_plz: string;
  email: string;
  start_zeit: string;
  end_zeit: string;
  anliegen: string;
  status: string;
}

interface Bewertung {
  id: number;
  auftrag_id: number;
  bewertung: number;
  nachricht: string;
  erstellt_am: string;
}

export interface BenutzerDaten {
  vorname: string;
  nachname: string;
  email: string;
  passwort: string;
  kategorie: string;
  stadt: string;
  straße: string;
  telefon: string;
  stundenlohn: string;
  bild: string;
  id: number;
  verified: boolean;
}

const AuftraegeSeite = () => {
  const [auftraege, setAuftraege] = useState<Auftrag[]>([]);
  const [bewertungen, setBewertungen] = useState<Bewertung[]>([]);
  const [benutzerDaten, setBenutzerDaten] = useState<BenutzerDaten | null>(null);
  const [istPopupSichtbar, setIstPopupSichtbar] = useState(false);
  const [popupNachricht, setPopupNachricht] = useState("");
  const [istBenutzerDatenModalOffen, setIstBenutzerDatenModalOffen] = useState(false);
  const [istBestätigungsModalOffen, setIstBestätigungsModalOffen] = useState(false);
  const [istAuftragModalOffen, setIstAuftragModalOffen] = useState(false);
  const [ausgewählterAuftrag, setAusgewählterAuftrag] = useState<Auftrag | null>(null);

  useEffect(() => {
    const benutzerDatenString = sessionStorage.getItem("benutzer");
    if (!benutzerDatenString) {
      window.location.href = "/login"; // Falls der Benutzer nicht eingeloggt ist
    } else {
      const benutzerDaten = JSON.parse(benutzerDatenString);
      setBenutzerDaten(benutzerDaten);
      fetchAuftraege(benutzerDaten.id);
    }
  }, []);

  const fetchAuftraege = (user_id: number) => {
    fetch(`http://localhost:8080/api/aufträge?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        setAuftraege(data);
      })
      .catch((err) => console.error("Fehler beim Abrufen der Aufträge:", err));
  };

  const handleShowAuftragModal = (auftrag: Auftrag) => {
    setAusgewählterAuftrag(auftrag);
    fetchBewertungen(auftrag.id);
    setIstAuftragModalOffen(true);
  };

  const fetchBewertungen = (auftrag_id: number) => {
    fetch(`http://localhost:8080/api/holeBewertungenAuftrag?auftrag_id=${auftrag_id}`)
      .then((res) => res.json())
      .then((data) => {
        setBewertungen(data);
      })
      .catch((err) => console.error("Fehler beim Abrufen der Bewertungen:", err));
  };

  const zeigePopup = (nachricht: string) => {
    setPopupNachricht(nachricht);
    setIstPopupSichtbar(true);
  };

  const schließePopup = () => {
    setIstPopupSichtbar(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("benutzer");
    window.location.href = "/login";
  };

  const handleBestätigungsModal = (auftrag: Auftrag) => {
    setAusgewählterAuftrag(auftrag);
    setIstBestätigungsModalOffen(true);
  };

  const handleConfirmMarkDone = () => {
    if (ausgewählterAuftrag) {
      markiereAuftragAlsDone(ausgewählterAuftrag.id);
      setIstBestätigungsModalOffen(false); // Schließt das Modal nach der Bestätigung
    }
  };

  const markiereAuftragAlsDone = (auftrag_id: number) => {
    fetch("http://localhost:8080/api/auftragDone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ auftrag_id }),
    })
      .then((res) => res.json())
      .then((updatedAuftrag) => {
        zeigePopup('Auftrag erfolgreich als abgeschlossen markiert.');
        setIstAuftragModalOffen(false);

        // Aktualisiere die Auftragsliste mit dem neuen Status
        setAuftraege((prevAuftraege) =>
          prevAuftraege.map((auftrag) =>
            auftrag.id === updatedAuftrag.id ? updatedAuftrag : auftrag
          )
        );
      })
      .catch((err) => {
        console.error('Fehler beim Markieren des Auftrags als "done":', err);
        zeigePopup('Fehler beim Markieren des Auftrags als "done".');
      });
  };

  return (
    <div className="min-h-screen flex flex-row bg-gray-100 text-black">
      {/* Sidebar Navigation */}
      <aside className="bg-yellow-600 w-64 flex flex-col p-6">
        <h1 className="text-4xl font-bold mb-10">MiniMeister</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <Link href="/dashboard" className="flex items-center text-lg font-semibold hover:text-white transition-colors">
                <FaArrowLeft className="mr-2" /> Zurück zum Dashboard
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Hauptinhalt */}
      <div className="flex-grow flex flex-col">
        <header className="bg-yellow-600 p-6 flex justify-between items-center">
          {benutzerDaten && (
            <span className="text-2xl font-bold">{`Willkommen, ${benutzerDaten.vorname}`}</span>
          )}
        </header>

        <main className="flex-grow container mx-auto p-6">
          <h2 className="text-2xl font-bold mb-4">Ihre Aufträge</h2>

          <div className="grid grid-cols-2 gap">
            {/* Offene Aufträge */}
            <div className="grid gap-4"> 
              <h3 className="text-xl font-bold mb-4">Offene Aufträge</h3>
              {auftraege.filter(auftrag => auftrag.status !== "done").length > 0 ? (
                auftraege
                  .filter(auftrag => auftrag.status !== "done")
                  .map((auftrag) => (
                    <div
                      key={auftrag.id}
                      className="bg-yellow-200 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-yellow-300 mb-4"
                      onClick={() => handleShowAuftragModal(auftrag)}
                    >
                      <p className="text-lg font-semibold">{auftrag.ausgewählter_tag}</p>
                      <p>{auftrag.start_zeit} - {auftrag.end_zeit}</p>
                      <p>{auftrag.anliegen}</p>
                    </div>
                  ))
              ) : (
                <br/>
              )}
            </div>

            {/* Abgeschlossene Aufträge */}
            <div className="grid gap-4"> 
              <h3 className="text-xl font-bold mb-4">Abgeschlossene Aufträge</h3>
              {auftraege.filter(auftrag => auftrag.status === "done").length > 0 ? (
                auftraege
                  .filter(auftrag => auftrag.status === "done")
                  .map((auftrag) => (
                    <div
                      key={auftrag.id}
                      className="bg-green-200 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-green-300"
                      onClick={() => handleShowAuftragModal(auftrag)}
                    >
                      <p className="text-lg font-semibold">{auftrag.ausgewählter_tag}</p>
                      <p>{auftrag.start_zeit} - {auftrag.end_zeit}</p>
                      <p>{auftrag.anliegen}</p>
                    </div>
                  ))
              ) : (
               
                <br/>
              )}
            </div>
          </div>
        </main>
      </div>

      {istAuftragModalOffen && ausgewählterAuftrag && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Auftragsdetails</h2>
            <p className="mb-2">
              <strong>Datum:</strong> {ausgewählterAuftrag.ausgewählter_tag}
            </p>
            <p className="mb-2">
              <strong>Zeit:</strong> {ausgewählterAuftrag.start_zeit} - {ausgewählterAuftrag.end_zeit}
            </p>
            <p className="mb-2">
              <strong>Anliegen:</strong> {ausgewählterAuftrag.anliegen}
            </p>
            <p className="mb-2">
              <strong>Adresse:</strong> {ausgewählterAuftrag.straßehausnummer}, {ausgewählterAuftrag.stadt_plz}
            </p>
            <p className="mb-2">
              <strong>Status:</strong> {ausgewählterAuftrag.status === "done" ? "✅ Erledigt" : "🕒 In Bearbeitung"}
            </p>

            <h3 className="text-xl font-bold mt-4">Bewertungen</h3>
            <div className="mt-2">
              {bewertungen.length > 0 ? (
                bewertungen.map((bewertung) => (
                  <div key={bewertung.id} className="mb-4 p-2 bg-gray-100 rounded">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`mr-1 ${i < bewertung.bewertung ? "text-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{bewertung.nachricht}</p>
                    <p className="text-gray-500 text-sm">
                      Bewertet am: {new Date(bewertung.erstellt_am).toLocaleDateString()}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-600">Keine Bewertungen für diesen Auftrag</p>
              )}
            </div>

            <div className="flex space-x-4 mt-4">
              {ausgewählterAuftrag.status !== "done" && (
                <button
                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                  onClick={() => handleBestätigungsModal(ausgewählterAuftrag)}
                >
                  Auftrag abschließen
                </button>
              )}
              <button
                className="bg-yellow-600 text-white p-2 rounded"
                onClick={() => setIstAuftragModalOffen(false)}
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}

      {istBestätigungsModalOffen && (
        <BestaetigungsModal
          message="Sind Sie sicher, dass Sie diesen Auftrag als abgeschlossen markieren möchten?"
          onConfirm={handleConfirmMarkDone}
          onCancel={() => setIstBestätigungsModalOffen(false)}
        />
      )}

      {istPopupSichtbar && (
        <Popup message={popupNachricht} onClose={schließePopup} />
      )}
    </div>
  );
};

export default AuftraegeSeite;
