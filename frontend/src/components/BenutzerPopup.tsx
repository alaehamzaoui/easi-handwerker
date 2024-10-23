// components/BenutzerPopup.tsx
"use client";

import Modal from 'react-modal';

interface BenutzerPopupProps {
    istOffen: boolean;
    onRequestClose: () => void;
    titel: string;
    inhalt: React.ReactNode;
}

const BenutzerPopup: React.FC<BenutzerPopupProps> = ({ istOffen, onRequestClose, titel, inhalt }) => {
    return (
        <Modal
            isOpen={istOffen}
            onRequestClose={onRequestClose}
            contentLabel={titel}
            className="p-8 border w-96 shadow-lg rounded-md bg-white mx-auto my-20"
            overlayClassName="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center"
        >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{titel}</h2>
            {inhalt}
            <button onClick={onRequestClose} className="mt-4 px-4 py-2 bg-yellow-500 rounded hover:bg-yellow-400 transition">
                Schließen
            </button>
        </Modal>
    );
};

export default BenutzerPopup;
