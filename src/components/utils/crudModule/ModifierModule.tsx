import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Form_Modif_Utilisateur.css";
import { useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Validation from "../../Validation";

const ModifierModule = () => {
  const { code_module } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const [infoModule, setInfoModule] = useState({
    nom_module: "",
    cout_module: 0,
  });

  useEffect(() => {
    const afficherModule = async () => {
      try {
        const reponse = await axios.get(`http://localhost:4000/module/${code_module}`);
        const Module = reponse.data;
        setInfoModule(Module);
      } catch (error) {
        console.error(`Erreur lors de la récupération du module : `, error);
      }
    };

    afficherModule();
  }, [code_module]);

  const handleSaisieChangee = (e: any) => {
    setInfoModule((prevInfoModule) => ({
      ...prevInfoModule,
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
      const reponse = await axios.put(`http://localhost:4000/module/modifier/${code_module}`, infoModule);

      console.log('Module mis à jour : ', reponse.data);
      window.history.back();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du module : `, error);
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
          placeholder='Nom du module'
          name="nom_module"
          value={infoModule.nom_module}
          onChange={handleSaisieChangee}
        />
        <input
          type="text"
          placeholder='Cout du module'
          name="cout_module"
          value={infoModule.cout_module}
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

export default ModifierModule;
