import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Form_Modif_Groupe.css";
import { useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Validation from "../../Validation";

const ModifierGroupe = () => {
  const { code_groupe } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const [infoGroupe, setInfoGroupe] = useState({
    nom_groupe: "",
  });

  useEffect(() => {
    const afficherGroupe = async () => {
      try {
        const reponse = await axios.get(`http://localhost:4000/groupe/${code_groupe}`);
        const Groupe = reponse.data;
        setInfoGroupe(Groupe);
      } catch (error) {
        console.error(`Erreur lors de la récupération du groupe : `, error);
      }
    };

    afficherGroupe();
  }, [code_groupe]);

  const handleSaisieChangee = (e: any) => {
    setInfoGroupe((prevInfogroupe) => ({
      ...prevInfogroupe,
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
      const reponse = await axios.put(`http://localhost:4000/groupe/modifier/${code_groupe}`, infoGroupe);

      console.log('groupe mis à jour : ', reponse.data);
      window.history.back();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'groupe : `, error);
    }
  }

  const annulerSoumission = async () => {
    setShowConfirmationDialog(false);
  }

  return (
    <div className="form_modification_groupe">
      <div className="retour_tBord">
          <button className="flex p-[13px]" onClick={ () => window.history.back() }>
            <div className="pl-12">Retour</div>
            <div className="p-[3px] pl-4"><FaArrowLeft /></div>
          </button>
      </div>

      <form className="formulaire h-screen overflow-hidden" onSubmit={handleSoumissionForm}>
        <h2 className="titre_modif_groupe">Modification groupe</h2>
        <input
          type="text"
          placeholder='Entrer votre nom'
          name="nom_groupe"
          value={infoGroupe.nom_groupe}
          onChange={handleSaisieChangee}
        />
        
        <div className="boutton_modification_groupe">
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

export default ModifierGroupe;
