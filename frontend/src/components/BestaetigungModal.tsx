interface BestaetigungModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }
  
  const BestaetigungsModal: React.FC<BestaetigungModalProps> = ({ message, onConfirm, onCancel }) => {
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
        <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Bestätigung</h2>
          <p className="mb-4">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
              onClick={onConfirm}
            >
              Bestätigen
            </button>
            <button
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              onClick={onCancel}
            >
              Abbrechen
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default BestaetigungsModal;