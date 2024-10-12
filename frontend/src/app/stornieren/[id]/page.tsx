"use client"
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  
import Popup from '../../../components/Popup';  

interface Props {
  params: {
    id: string;  
  };
}

const AuftragStornierenPage = ({ params }: Props) => {
  const router = useRouter();  
  const { id } = params;       

  const [istPopupSichtbar, setIstPopupSichtbar] = useState(false);
  const [popupNachricht, setPopupNachricht] = useState('');

  const zeigePopup = (nachricht: string) => {
    setPopupNachricht(nachricht);
    setIstPopupSichtbar(true);
  };

  useEffect(() => {
    const deleteAuftrag = async () => {
      try {
        const response = await fetch(`http://localhost:8080/auftrag/${id}/storniere`, {
          method: 'DELETE',
        });

        if (response.ok) {
          zeigePopup('Buchung erfolgreich gelöscht');
          setTimeout(() => {
            window.location.href = '/';
        }, 3000);
        } else {
          
        }
      } catch (error) {
        console.error('Fehler:', error);
        zeigePopup('Fehler bei der Stornierung der Buchung');
      }
    };

    if (id) {
      deleteAuftrag();
    }
  }, [id]);

  return (
    <div>
      <h1>Ihre Buchung wird storniert</h1>
      {istPopupSichtbar && <Popup message={popupNachricht} onClose={() => setIstPopupSichtbar(false)} />}
    </div>
  );
};

export default AuftragStornierenPage;