import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Form_Modif_Utilisateur.css";
import { useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Validation from "../../Validation";

const ModifierModule = () => {
  const { code_module } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [code_formation, setCodeFormation] = useState();
  const [infoFormation, setInfoFormation] = useState({
      nom_formation: "",
      cout_formation: 0,
      publication: "Non",
  });

  const [infoModule, setInfoModule] = useState({
    nom_module: "",
    cout_module: 0,
  });

  useEffect(() => {
    const afficherModule = async () => {
      try {
        const reponse = await axios.get(`http://localhost:4000/module/${code_module}`);
        const Module = reponse.data;
        setCodeFormation(reponse.data.code_formation);
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

      
      const cout_actuelle_formation = await axios.get(`http://localhost:4000/module/somme_cout_par_formation/${code_formation}`);
      console.log('Coup actuel', cout_actuelle_formation.data);

      const cout_formation_ = await cout_actuelle_formation.data;

      const infoF = await axios.get(`http://localhost:4000/formation/${code_formation}`)
          .catch(error => {
              console.error('Erreur lors de la récupération des informations sur la formation :', error);
              throw error;
          });

      const formation = infoF.data;
      console.log("infoF: ", formation);

      setInfoFormation(prevInfoFormation => {
          const newInfoFormation = {
              ...prevInfoFormation,
              nom_formation: formation.nom_formation,
              cout_formation: cout_formation_.sum,
              publication: formation.publication,
          };
          console.log('Total cout_formation:', cout_formation_, '\nNouveau_infoFormation: ', newInfoFormation, '\nAncien_infoFormation: ', infoFormation);

          setInfoFormation(newInfoFormation);

          axios.put(`http://localhost:4000/formation/modifier/${code_formation}`, newInfoFormation);

          return newInfoFormation;
      });

      window.history.back();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour du module : `, error);
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

      <form className="formulaire_modif_utilisateur  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[60%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleSoumissionForm}>
        <h2 className="titre_modif_utilisateur">Modification module</h2>
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

export default ModifierModule;
