import React, { useState } from "react";
import axios from "axios";
import "../../styles/FormulaireGroupeCreation.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Validation from "../../Validation";


const  FormulaireGroupe: React.FC = () => {
  const [nomGroupe, setNomGroupe] = useState('');
  const [popupStyle, setPopupStyle] = useState<string>("hide");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const handleInput = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setShowConfirmationDialog(true);
  };

  const confirmerCreationGroupe = async () => {
    setShowConfirmationDialog(false);

    const nouveauGroupe = {
      nom_groupe: nomGroupe,
    };

    try {
      const response = await axios.post('http://localhost:4000/groupe/creer/', nouveauGroupe);
      console.log('Groupe bien créé avec succès', response.data);
      window.history.back();
    } catch (error) {
      setPopupStyle("popup_connexion");
      setTimeout(() => setPopupStyle("hide"), 3000);
      const err = error
      console.error('Erreur lors de la création', err);
    }
  }

  const annulerCreationGroupe = async () => {
    setShowConfirmationDialog(false);
  }


  return (
    <div className="form_groupe_creation">

      <div className="retour_tBord">
          <button className="flex p-[13px]" onClick={ () => window.history.back() }>
            <div className="pl-12">Retour</div>
            <div className="p-[3px] pl-4"><FaArrowLeft /></div>
          </button>
      </div>

      <div className={popupStyle}>
        <h3>Error !!</h3>
        <p>Erreur lors de la création</p>
      </div>

      <form className="FormulaireCreerGroupe h-screen overflow-hidden" onSubmit={handleInput}>
        <h1 className="titre_creation_gorupe">Nouveau groupe</h1>
        <input
          type="text"
          placeholder='Saissisez le nom du groupe'
          value={nomGroupe}
          onChange={(e) => setNomGroupe(e.target.value)}
        />

        <div className="boutton_inscription">
          <button type="submit" className="flex">
            <div className="pl-4">Créer</div>
            <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
          </button>
        </div>
      </form>

      <Validation
        isOpen={showConfirmationDialog}
        onConfirm={confirmerCreationGroupe}
        onCancel={annulerCreationGroupe}
        message="Confirmer l'inscription ?"
        bg_modal_show="bg-white shadow-sm"
        style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
        style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
      />

    </div>
  );
};

export default FormulaireGroupe;
