"use client";

import { useState, useEffect } from "react";
import {
  FaClock,
  FaUser,
  FaLifeRing,
  FaCheckCircle,
  FaTimesCircle,
  FaSignOutAlt,
  FaStar,
} from "react-icons/fa";
import Image from "next/image";
import ArbeitszeitModal from "../../components/ArbeitszeitModal";
import PersoenlicheDatenModal from "../../components/PersoenlicheDatenModal";
import Popup from "../../components/Popup";
import BestaetigungsModal from "../../components/BestaetigungModal";

interface Arbeitszeit {
  tag: string;
  von: string;
  bis: string;
}

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

interface Bewertung {
  id: number;
  auftrag_id: number;
  bewertung: number;
  nachricht: string;
  erstellt_am: string;
}

const Dashboard = () => {
  const [arbeitszeiten, setArbeitszeiten] = useState<Arbeitszeit[]>([]);
  const [auftraege, setAuftraege] = useState<Auftrag[]>([]);
  const [istModalOffen, setIstModalOffen] = useState(false);
  const [istBenutzerDatenModalOffen, setIstBenutzerDatenModalOffen] =
    useState(false);
  const [istSupportPopupOffen, setIstSupportPopupOffen] = useState(false);
  const [benutzerDaten, setBenutzerDaten] = useState<BenutzerDaten | null>(
    null
  );
  const [popupNachricht, setPopupNachricht] = useState("");
  const [istPopupSichtbar, setIstPopupSichtbar] = useState(false);
  const [istAuftragModalOffen, setIstAuftragModalOffen] = useState(false);
  const [ausgewählterAuftrag, setAusgewählterAuftrag] =
    useState<Auftrag | null>(null);
  const [bewertungen, setBewertungen] = useState<Bewertung[]>([]);

  const zeigePopup = (nachricht: string) => {
    setPopupNachricht(nachricht);
    setIstPopupSichtbar(true);
  };

  const schließePopup = () => {
    setIstPopupSichtbar(false);
  };

  const [istBestätigungsModalOffen, setIstBestätigungsModalOffen] =
    useState(false);
  const [auftragZumAbschließen, setAuftragZumAbschließen] =
    useState<Auftrag | null>(null);

  const handleBestätigungsModal = (auftrag: Auftrag) => {
    setAuftragZumAbschließen(auftrag);
    setIstBestätigungsModalOffen(true);
  };
  

  const handleConfirmMarkDone = () => {
    if (auftragZumAbschließen) {
      markiereAuftragAlsDone(auftragZumAbschließen.id);
      setIstBestätigungsModalOffen(false); // Schließt das Modal nach der Bestätigung
    }
  };

  useEffect(() => {
    const benutzerDatenString = sessionStorage.getItem("benutzer");
    if (!benutzerDatenString) {
      window.location.href = "/login";
    } else {
      const benutzerDaten = JSON.parse(benutzerDatenString);
      setBenutzerDaten(benutzerDaten);
      fetchArbeitszeiten(benutzerDaten.email);
      fetchAuftraege(benutzerDaten.id);
    }
  }, []);

  const fetchAuftraege = (user_id: number) => {
    console.log("Fetching Aufträge for user_id:", user_id);
    fetch(`http://localhost:8080/api/aufträge?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log("Aufträge abgerufen:", data);  // Debugging
        setAuftraege(data);
      })
      .catch((err) => console.error("Fehler beim Abrufen der Aufträge:", err));
  };

  const fetchBewertungen = (auftrag_id: number) => {
    fetch(`http://localhost:8080/api/holeBewertungenAuftrag?auftrag_id=${auftrag_id}`)
      .then((res) => res.json())
      .then((data) => {
        setBewertungen(data);
      })
      .catch((err) => console.error("Fehler beim Abrufen der Bewertungen:", err));
  };

  const fetchArbeitszeiten = (email: string) => {
    fetch(`http://localhost:8080/workTimes?email=${email}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Arbeitszeiten abgerufen:", data); // Debugging
        setArbeitszeiten(data);
      })
      .catch((err) =>
        console.error("Fehler beim Abrufen der Arbeitszeiten:", err)
      );
  };
  const handleUpdateArbeitszeit = (
    aktualisierteArbeitszeiten: Arbeitszeit[]
  ) => {
    fetch("http://localhost:8080/workTimes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: benutzerDaten?.email || "",
        workTimes: aktualisierteArbeitszeiten,
      }),
    })
      .then((res) => res.json())
      .then(() => {
        fetchArbeitszeiten(benutzerDaten?.email || "");
        setIstModalOffen(false);
      })
      .catch((err) =>
        console.error("Fehler beim Aktualisieren der Arbeitszeiten:", err)
      );
  };

  const handleShowSupportPopup = () => {
    setIstSupportPopupOffen(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("benutzer");
    window.location.href = "/login";
  };

  const handleShowBenutzerDatenModal = () => {
    setIstBenutzerDatenModalOffen(true);
  };

  const handleShowAuftragModal = (auftrag: Auftrag) => {
    setAusgewählterAuftrag(auftrag);
    fetchBewertungen(auftrag.id);
    setIstAuftragModalOffen(true);
  };

  const handleUpdateBenutzerDaten = (
    aktualisierteBenutzerDaten: BenutzerDaten
  ) => {
    fetch("http://localhost:8080/updateUserData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(aktualisierteBenutzerDaten),
    })
      .then((res) => res.json())
      .then((data) => {
        setBenutzerDaten(data);
        setIstBenutzerDatenModalOffen(false);
        zeigePopup("Daten wurden erfolgreich aktualisiert!");
      })
      .catch((err) => {
        console.error("Fehler beim Aktualisieren der Benutzerdaten:", err);
        zeigePopup("Bitte versuchen Sie es erneut.");
      });
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
        zeigePopup('Auftrag erfolgreich als "done" markiert.');
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
      <aside className="bg-yellow-600 w-64 flex flex-col p-6">
        <h1 className="text-4xl font-bold mb-10">MiniMeister</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <button
                onClick={handleShowBenutzerDatenModal}
                className="flex items-center text-lg font-semibold hover:text-white transition-colors"
              >
                <FaUser className="mr-2" /> Daten bearbeiten
              </button>
            </li>
            <li className="mb-4">
              <button
                onClick={handleShowSupportPopup}
                className="flex items-center text-lg font-semibold hover:text-white transition-colors"
              >
                <FaLifeRing className="mr-2" /> Support
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      <div className="flex-grow flex flex-col">
        <header className="bg-yellow-600 p-6 flex justify-between items-center">
          {benutzerDaten && (
            <span className="text-2xl font-bold">{`Willkommen, ${benutzerDaten.vorname}`}</span>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-500 flex items-center transition-colors"
          >
            <FaSignOutAlt className="mr-2" /> Ausloggen
          </button>
        </header>

        <main className="flex-grow container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Benutzerkarte mit Verifizierungsstatus und Buttons */}
              {benutzerDaten && (
                <div className="bg-white shadow-md rounded p-6 mb-8 text-center relative">
                  <img
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                    src={benutzerDaten?.bild} // Verwende externe Bild-URLs
                    alt="Persönliche Daten"
                    width={128}
                    height={128}
                  />

                  <h2 className="text-yellow-600 text-xl font-bold">{`${benutzerDaten.vorname} ${benutzerDaten.nachname}`}</h2>
                  <p className="text-gray-600">{benutzerDaten.kategorie}</p>
                  <p className="text-gray-600">{benutzerDaten.stadt}</p>
                  <p className="text-gray-600">{benutzerDaten.straße}</p>
                  <p className="text-gray-600">{benutzerDaten.telefon}</p>
                  <p className="text-gray-600">{benutzerDaten.stundenlohn}€</p>
                  <div className="flex items-center justify-center mt-4">
                    {benutzerDaten.verified ? (
                      <>
                        <FaCheckCircle className="text-green-500 text-2xl mr-2" />
                        <span className="text-green-500 font-semibold">
                          Profil verifiziert
                        </span>
                      </>
                    ) : (
                      <>
                        <FaTimesCircle className="text-red-500 text-2xl mr-2" />
                        <span className="text-red-500 font-semibold">
                          Profil nicht verifiziert
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Arbeitszeiten */}
              <h2 className="text-2xl font-bold mt-8 mb-4">
                Ihre Arbeitszeiten
              </h2>
              <table className="bg-white table-auto w-full shadow-md rounded text-center mb-8">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2">Tag</th>
                    <th className="px-4 py-2">Von</th>
                    <th className="px-4 py-2">Bis</th>
                  </tr>
                </thead>
                <tbody>
                  {arbeitszeiten.length > 0 ? (
                    arbeitszeiten.map((arbeitszeit, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">{arbeitszeit.tag}</td>
                        <td className="px-4 py-2">{arbeitszeit.von}</td>
                        <td className="px-4 py-2">{arbeitszeit.bis}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-4 py-2">
                        Keine Arbeitszeiten gefunden.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Button für Arbeitszeitenbearbeitung */}
              <div className="flex space-x-4">
                <button
                  className="bg-yellow-600 text-black py-2 px-4 rounded hover:bg-yellow-700 flex items-center text-lg font-semibold transition-colors"
                  onClick={() => setIstModalOffen(true)}
                >
                  <FaClock className="mr-2" /> Arbeitszeiten bearbeiten
                </button>
              </div>
              {/* Aufträge */}
              <h2 className="text-2xl font-bold mt-8 mb-4">Ihre Aufträge</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {auftraege.length > 0 ? (
                  auftraege.map((auftrag, index) => (
                    <div
                      key={index}
                      className={`border border-gray-300 p-4 rounded-lg shadow-sm transition-colors cursor-pointer ${
                        auftrag.status === "done"
                          ? "bg-green-200"
                          : "bg-yellow-200 hover:bg-yellow-300"
                      }`}
                      onClick={() => handleShowAuftragModal(auftrag)}
                    >
                      <p className="text-lg font-semibold">
                        {auftrag.ausgewählter_tag}
                      </p>
                      <p className="text-gray-700">
                        {auftrag.start_zeit} - {auftrag.end_zeit}
                      </p>
                      <p className="text-gray-600">{auftrag.anliegen}</p>
                      <p className="text-gray-600">
                        <strong>Status:</strong>{" "}
                        {auftrag.status === "done"
                          ? "✅ Erledigt"
                          : "🕒 In Bearbeitung"}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">
                    Sie haben zurzeit keine Aufträge
                  </p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Arbeitszeit-Modal */}
      {istModalOffen && (
        <ArbeitszeitModal
          initialArbeitszeiten={arbeitszeiten}
          onSave={handleUpdateArbeitszeit}
          onCancel={() => {
            setIstModalOffen(false);
            fetchArbeitszeiten(benutzerDaten.email);
          }}
        />
      )}

      {/* BenutzerDaten-Modal */}
      {istBenutzerDatenModalOffen && benutzerDaten && (
        <PersoenlicheDatenModal
          initialBenutzerDaten={benutzerDaten}
          onSave={handleUpdateBenutzerDaten}
          onCancel={() => setIstBenutzerDatenModalOffen(false)}
        />
      )}
      {/* hier ist das Modal */}

      {/* Auftrags-Modal */}
      {istAuftragModalOffen && ausgewählterAuftrag && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Auftragsdetails</h2>
            <p className="mb-2">
              <strong>Datum:</strong> {ausgewählterAuftrag.ausgewählter_tag}
            </p>
            <p className="mb-2">
              <strong>Zeit:</strong> {ausgewählterAuftrag.start_zeit} -{" "}
              {ausgewählterAuftrag.end_zeit}
            </p>
            <p className="mb-2">
              <strong>Anliegen:</strong> {ausgewählterAuftrag.anliegen}
            </p>
            <p className="mb-2">
              <strong>Adresse:</strong> {ausgewählterAuftrag.straßehausnummer},{" "}
              {ausgewählterAuftrag.stadt_plz}
            </p>
            <p className="mb-2">
              <strong>Status:</strong>{" "}
              {ausgewählterAuftrag.status === "done"
                ? "✅ Erledigt"
                : "🕒 In Bearbeitung"}
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
                          className={`mr-1 ${
                            i < bewertung.bewertung ? "text-yellow-500" : "text-gray-300"
                          }`}
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
          message="Sind Sie sicher, dass Sie diesen Auftrag als 'done' markieren möchten?"
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

export default Dashboard;
