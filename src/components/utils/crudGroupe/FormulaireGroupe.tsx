import React, { useState } from "react";
import axios from "axios";
import "../../styles/FormulaireGroupeCreation.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Validation from "../../Validation";


const FormulaireGroupe: React.FC = () => {
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
    <div className="form_groupe_creation relative w-screen h-screen box-border m-0 pb-8 text-center justify-center bg-cover bg-fixed bg-no-repeat bg-center font-sans overflow-y-scroll">

      <div className="relative w-full h-[10%]" onClick={() => window.history.back()} >
        <div className="flex relative w-full z-20">
          <button className="retour_acceuil absolute px-0 w-[180px] top-[9px] left-[10px] h-[35px] lg:px-8 lg:w-[250px] lg:top-[12.25px] lg:left-[30px] lg:h-[50px] rounded-[30px] text-white font-bold shadow-md shadow-gray-700 border-2 border-white flex items-center hover:bg-green-700">
            <div className="pl-4">Retour à l'acceuil</div>
            <div className="p-[4px] pl-3"><FaArrowLeft /></div>
          </button>
        </div>
      </div>

      <div className={popupStyle}>
        <h3>Error !!</h3>
        <p>Erreur lors de la création</p>
      </div>

      <form className="FormulaireCreerGroupe absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[40%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleInput}>
        <h1 className="titre_creation_gorupe text-center">Nouveau groupe</h1>
        <input
          type="text"
          placeholder='Saissisez le nom du groupe'
          value={nomGroupe}
          onChange={(e) => setNomGroupe(e.target.value)}
        />
        
        <button type="submit" className="boutton_inscription cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]" >
          <div className="pl-4">Créer</div>
          <div className="pl-4 pr-4"><FaPlus /></div>
        </button>
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
