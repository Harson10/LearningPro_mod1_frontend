import axios from "axios";
import { useState, useEffect } from "react";
import { BoxWrapper } from "./BoxWrapper";
import { FaChalkboardTeacher, FaUser, FaUserShield, FaUsers } from "react-icons/fa";

const Effectif: React.FC = () => {

    const [totalUtilisateurs, setTotalUtilisateurs] = useState<number>(0);
  const [administrateurs, setAdministrateurs] = useState<number>(0);
  const [formateurs, setFormateurs] = useState<number>(0);
  const [participants, setParticipants] = useState<number>(0);

  useEffect(() => {
    const afficherInfo = async () => {
      try {
        const responseTotal = await axios.get('http://localhost:4000/utilisateur/nombre/total');
        const responseAdmin = await axios.get('http://localhost:4000/utilisateur/nombre/administrateur');
        const responseFormateur = await axios.get('http://localhost:4000/utilisateur/nombre/formateur');
        const responseParticipant = await axios.get('http://localhost:4000/utilisateur/nombre/participant');

        setTotalUtilisateurs(responseTotal.data);
        setAdministrateurs(responseAdmin.data);
        setFormateurs(responseFormateur.data);
        setParticipants(responseParticipant.data);
      } catch (error) {
        console.error('Une erreur s\'est produite lors de la récupération des données:', error);
      }
    };

    afficherInfo();
  }, []);


    return (
        <div className="p-[20px]">
            <div>
                <div className="flex flex-col gap-4 lg:flex-row lg:gap-4 w-full">
                    <BoxWrapper>
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-sky-500 ">
                            <FaUsers className="text-2xl text-white" />
                        </div>
                        <div className="pl-4">
                            <span className="text-sm text-gray-500 font-light">Total</span>
                            <div className="flex item-center">
                                <strong className="text-2xl text-gray-700 font-semibold">{totalUtilisateurs}</strong>
                            </div>
                        </div>
                    </BoxWrapper>
                    <BoxWrapper>
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-orange-600 ">
                            <FaUserShield className="text-2xl text-white" />
                        </div>
                        <div className="pl-4">
                            <span className="text-sm text-gray-500 font-light">Administrateur(s)</span>
                            <div className="flex item-center">
                                <strong className="text-2xl text-gray-700 font-semibold">{administrateurs}</strong>
                            </div>
                        </div>
                    </BoxWrapper>
                    <BoxWrapper>
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-400 ">
                            <FaChalkboardTeacher className="text-2xl text-white" />
                        </div>
                        <div className="pl-4">
                            <span className="text-sm text-gray-500 font-light">Formateur(s) </span>
                            <div className="flex item-center">
                                <strong className="text-2xl text-gray-700 font-semibold">{formateurs}</strong>
                            </div>
                        </div>
                    </BoxWrapper>
                    <BoxWrapper>
                        <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-500 ">
                            <FaUser className="text-2xl text-white" />
                        </div>
                        <div className="pl-4">
                            <span className="text-sm text-gray-500 font-light">Participant(s)</span>
                            <div className="flex item-center">
                                <strong className="text-2xl text-gray-700 font-semibold">{participants}</strong>
                            </div>
                        </div>
                    </BoxWrapper>
                </div>
            </div>
        </div>
    );
}

export default Effectif;

