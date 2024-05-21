import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Form_Modif_Utilisateur.css";
import { useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Validation from "../../Validation";

const ModifierUtilisateur = () => {
  const { code_utilisateur } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const [infoUtilisateur, setInfoUtilisateur] = useState({
    mot_de_passe: "",
    nom: "",
    prenom: "",
    adresse: "",
    sexe: "",
    profession: "",
  });

  useEffect(() => {
    const afficherUtilisateur = async () => {
      try {
        const reponse = await axios.get(`http://localhost:4000/utilisateur/${code_utilisateur}`);
        const Utilisateur = reponse.data;
        setInfoUtilisateur(Utilisateur);
      } catch (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur : `, error);
      }
    };

    afficherUtilisateur();
  }, [code_utilisateur]);

  const handleSaisieChangee = (e: any) => {
    setInfoUtilisateur((prevInfoUtilisateur) => ({
      ...prevInfoUtilisateur,
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

      console.log('Utilisateur mis à jour : ', reponse.data);
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

      <form className="formulaire_modif_utilisateur h-[70%] overflow-hidden" onSubmit={handleSoumissionForm}>
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
          placeholder='Saissisez le nouveau mot de passe'
          name="mot_de_passe"
          value={infoUtilisateur.mot_de_passe}
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

export default ModifierUtilisateur;
