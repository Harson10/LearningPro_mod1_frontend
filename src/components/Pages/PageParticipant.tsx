import React, { useState } from 'react';
import ListeModules from '../utils/crudModule/ListeModulesParticipant';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import Validation from '../Validation';
import { useAuth } from '../../context/AuthContext';

const Participant: React.FC = () => {

  
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
    <div className='flex items-center bg-gray-300'>
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

        <div className="bouton_deconnexion hover:scale-110" onClick={handleDeconnexion}>
          <div className="pl-4 hidden lg:block">Se déconnecter</div>
          <div className="pl-4 pr-4 text-2xl lg:text-base"><FaSignOutAlt /></div>
        </div>
      </div>
      
      <div className="mt-[20%] lg:mt-0 flex items-center w-screen h-screen overflow-auto">
        <ListeModules />
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

export default Participant;