import React, { useState } from 'react';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import Validation from '../Validation';
import { useAuth } from '../../context/AuthContext';
import ListeEtapeContenuParticipant from '../utils/crudEtape/ListeEtapeContenuParticipant';
import "../styles/TableauDeBordBase.css";

const ParticipantB: React.FC = () => {


  const { deconnexion } = useAuth();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);


  const handleDeconnexion = async () => {
    setShowConfirmationDialog(true);
  }

  const confirmerDeconnexion = async () => {
    setShowConfirmationDialog(false);
    localStorage.removeItem("token");
    deconnexion();
    window.location.href = "/connexion";
  }

  const annulerDeconnexion = async () => {
    setShowConfirmationDialog(false)
  }


  return (
    <div className='tableau-de-bord-base'>
      <div className="top-bloc">

        <div className="title h-auto">
          <div><strong><h1>LEARNING PRO</h1></strong></div>
          <div className="pr-8">
            Participant
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="absolute translate-y-[-25px] pl-[50px]">
                <FaUserCircle />
              </div>
            </div>
          </div>
        </div>

        <div className="bouton_deconnexion" onClick={handleDeconnexion}>
          <div className="pl-4">Se déconnecter</div>
          <div className="pl-4 pr-4"><FaSignOutAlt /></div>
        </div>
      </div>

      <div className="body-bloc">
        <div className="sections">
          <section id="section1" className="section2 pt-[100px] w-screen h-screen">
            <div className="p-[10px] overflow-hidden flex">
              <ListeEtapeContenuParticipant />
            </div>
          </section>
        </div>
      </div>

      <div className="fixed z-20">
        <Validation
          isOpen={showConfirmationDialog}
          onConfirm={confirmerDeconnexion}
          onCancel={annulerDeconnexion}
          message="Se déconnecter de Learning Pro ?"
          bg_modal_show="bg-white shadow-sm"
          style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-red-500 hover:text-white"
          style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
        />
      </div>

    </div>
  );
}

export default ParticipantB;