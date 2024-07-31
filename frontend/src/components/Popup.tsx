// components/Popup.tsx
import { useState } from 'react';
import styles from '../styles/Popup.module.css';

interface PopupProps {
    message: string;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ message, onClose }) => {
    return (
        <div className={styles.popupContainer}>
            <div className={styles.popup}>
                <p>{message}</p>
                <button onClick={onClose}>Schließen</button>
            </div>
        </div>
    );
};

export default Popup;
