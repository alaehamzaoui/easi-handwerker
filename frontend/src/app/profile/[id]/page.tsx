import React from "react";
import handwerkerData from "../../data/data"; // Importiere die Handwerkerdaten aus der data.js-Datei
import Image from 'next/image';
import logo from "../../../images/MiniMeister-Logo-white.png"; // Importiere das Logo

interface ProfileDetailsProps {
  id: string; // Da die ID als String in der Route übergeben wird
}

const ProfileDetails = ({ params }: { params: { id: string } }) => {
  // Finde den Handwerker mit der entsprechenden ID
  const { id } = params;    
  console.log(id)

  const craftsman = handwerkerData.find((craftsman) => craftsman.id === parseInt(id));

  if (!craftsman) {
    return <div>Handwerker nicht gefunden.</div>;
  }

  const { vorname, nachname, stadt, categorie, telefonnummer } = craftsman;

  return (
    <div className="flex justify-center flex-col items-center mt-10">
      <div className="absolute top-0 left-0 m-4">
        <Image src={logo} alt="MiniMeister Logo" width={100} height={100} />
      </div>
      <div className="max-w-4xl mx-4 mt-10 bg-yellow-600 rounded-lg shadow-xl p-6 flex space-x-6">
        <div className="flex-1">
          <h1 className="text-black text-3xl font-bold mb-4">{`${vorname} ${nachname}`}</h1>
          <p className="text-black mb-2">{categorie}</p>
        </div>

        {/* Right Section - Craftsman Card */}
        <div className="w-80 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-black text-2xl font-bold mb-2">Handwerker Details</h2>
          <p className="text-black mb-2">
            Stadt: <span className="font-semibold">{stadt}</span>
          </p>
          <p className="text-black mb-2">
            Art der Ausbildung: <span className="font-semibold">{categorie}</span>
          </p>
          <p className="text-black mb-2">
            Telefonnummer: <span className="font-semibold">{telefonnummer}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfileDetails;
