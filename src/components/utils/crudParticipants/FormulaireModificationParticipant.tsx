import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Form_Modif_Utilisateur.css";
import { useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Validation from "../../Validation";

const ModifierParticipant: React.FC = () => {
  const { code_utilisateur, code_participant } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const [infoUtilisateur, setInfoUtilisateur] = useState({
    nom: "",
    prenom: "",
    adresse: "",
    sexe: "",
    profession: "",
  });

  const [infoParticipant, setInfoParticipant] = useState({
    numCIN: "",
    nomTuteur: "",
    prenomTuteur:"",
    niveau:"",
    diplome:"",
  });

  useEffect(() => {
    const afficherUtilisateur = async () => {
      try {
        const reponse = await axios.get(`http://localhost:4000/utilisateur/${code_utilisateur}`);
        const Utilisateur = reponse.data;
        setInfoUtilisateur(Utilisateur);

        const reponse2 = await axios.get(`http://localhost:4000/participant/${code_participant}`);
        const Participant = reponse2.data;
        setInfoParticipant(Participant);
      } catch (error) {
        console.error(`Erreur lors de la récupération : `, error);
      }
    };

    afficherUtilisateur();
  }, [code_utilisateur, code_participant]);

  const handleSaisieChangee = (e: any) => {
    setInfoUtilisateur((prevInfoUtilisateur) => ({
      ...prevInfoUtilisateur,
      [e.target.name]: e.target.value,
    }));
    setInfoParticipant((prevInfoParticipant) => ({
      ...prevInfoParticipant,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSoumissionForm = async (e: any) => {
    e.preventDefault();
    
    setShowConfirmationDialog(true);
  };

  const confirmerSoumission = async () => {
    setShowConfirmationDialog(false);

    try {
      const reponse = await axios.put(`http://localhost:4000/utilisateur/modifier/${code_utilisateur}`, infoUtilisateur);
      const reponse2 = await axios.put(`http://localhost:4000/participant/modifier/${code_participant}`, infoParticipant);

      console.log('Utilisateur mis à jour : ', reponse.data);
      console.log('Utilisateur mis à jour : ', reponse2.data);
      window.history.back();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'utilisateur : `, error);
    }
  }

  const annulerSoumission = async () => {
    setShowConfirmationDialog(false);
  }

  return (
    <div className="form_modification_utilisateur">
      <div className="retour_tabBord_modif">
          <button onClick={() => window.history.back()} className="flex p-[13px]">
            <div className="pl-12">Retour</div>
            <div className="p-[3px] pl-4"><FaArrowLeft /></div>
          </button>
      </div>

      <form className="formulaire_modif_utilisateur h-[88%] overflow-hidden" onSubmit={handleSoumissionForm}>
        <h2 className="titre_modif_utilisateur">Modification Utilisateur</h2>
        <input
          type="text"
          placeholder='Saissisez le nouveau nom'
          name="nom"
          value={infoUtilisateur.nom}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez le nouveau prénom'
          name="prenom"
          value={infoUtilisateur.prenom}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez la nouvelle adresse'
          name="adresse"
          value={infoUtilisateur.adresse}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez la nouvelle profession'
          name="profession"
          value={infoUtilisateur.profession}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez le numéro de CIN'
          name="numCIN"
          value={infoParticipant.numCIN}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez le nom du tuteur'
          name="nomTuteur"
          value={infoParticipant.nomTuteur}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez le prenom du tuteur'
          name="prenomTuteur"
          value={infoParticipant.prenomTuteur}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez le niveau'
          name="niveau"
          value={infoParticipant.niveau}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Saissisez le diplome'
          name="diplome"
          value={infoParticipant.diplome}
          onChange={handleSaisieChangee}
        />
        <div className="boutton_modification_utilisateur">
          <button type="submit" className="flex">
            <div className="pl-4">Enregistrer</div>
            <div className="text-4xs p-[5px] pl-4 pr-4"><FaSave /></div>
          </button>
        </div>
      </form>
      
      <Validation
        isOpen={showConfirmationDialog}
        onConfirm={confirmerSoumission}
        onCancel={annulerSoumission}
        message="Êtes-vous sûr des modifications ?"
        bg_modal_show="bg-white shadow-sm"
        style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
        style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
      />

    </div>
  );
};

export default ModifierParticipant;
