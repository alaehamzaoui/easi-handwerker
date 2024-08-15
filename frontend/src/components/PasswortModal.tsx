import React, { useState } from 'react';

const PasswortModal = ({ email, onSave, onCancel }) => {
  const [neuesPasswort, setNeuesPasswort] = useState('');

  const handleSave = () => {
    onSave(neuesPasswort);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Passwort ändern</h2>
        <input
          type="password"
          value={neuesPasswort}
          onChange={(e) => setNeuesPasswort(e.target.value)}
          placeholder="Neues Passwort"
        />
        <button onClick={handleSave}>Speichern</button>
        <button onClick={onCancel}>Abbrechen</button>
      </div>
    </div>
  );
};

export default PasswortModal;
