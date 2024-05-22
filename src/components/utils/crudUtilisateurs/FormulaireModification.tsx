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
        const reponse = await axios.get(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/utilisateur/${code_utilisateur}`);
        // const reponse = await axios.get(`http://localhost:4000/utilisateur/${code_utilisateur}`);
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
      const reponse = await axios.put(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/utilisateur/modifier/${code_utilisateur}`, infoUtilisateur);
      // const reponse = await axios.put(`http://localhost:4000/utilisateur/modifier/${code_utilisateur}`, infoUtilisateur);

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
    <div className="form_modification_utilisateur relative w-screen h-screen box-border m-0 pb-8 text-center justify-center bg-cover bg-fixed bg-no-repeat bg-center font-sans">

      <div className="relative w-full h-[10%]" onClick={() => window.history.back()} >
        <div className="flex relative w-full z-20">
          <button className="retour_tabBord_modif absolute px-0 w-[180px] top-[9px] left-[10px] h-[35px] lg:px-8 lg:w-[250px] lg:top-[12.25px] lg:left-[30px] lg:h-[50px] rounded-[30px] text-white font-bold shadow-md shadow-gray-700 border-2 border-white flex items-center hover:bg-green-700">
            <div className="pl-12">Retour</div>
            <div className="p-[3px] pl-4"><FaArrowLeft /></div>
          </button>
        </div>
      </div>

      <form className="formulaire_modif_utilisateur  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[80%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleSoumissionForm}>
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
        <button type="submit" className="boutton_modification_utilisateur cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]">
          <div className="pl-4">Enregistrer</div>
          <div className="text-4xs p-[5px] pl-4 pr-4"><FaSave /></div>
        </button>
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
