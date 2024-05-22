import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Form_Modif_Utilisateur.css";
import { useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Validation from "../../Validation";

const ModifierFormation = () => {
  const { code_formation } = useParams();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [pub, setPub] = useState(false);

  const [infoFormation, setInfoFormation] = useState({
    nom_formation: "",
    cout_formation: 0,
    publication: "Non",
  });

  useEffect(() => {
    const afficherFormation = async () => {
      try {
        const reponse = await axios.get(`http://localhost:4000/formation/${code_formation}`);
        const formation = reponse.data;
  
        // Définir la valeur initiale de pub en fonction de la valeur de publication
        const pubValue = formation.publication === "Oui";
        setPub(pubValue);
  
        // Mise à jour du reste des informations de la formation
        setInfoFormation({
          nom_formation: formation.nom_formation,
          cout_formation: formation.cout_formation,
          publication: formation.publication,
        });
      } catch (error) {
        console.error(`Erreur lors de la récupération de la formation : `, error);
      }
    };
  
    afficherFormation();
  }, [code_formation]);
  

  const handleSaisieChangee = (e: any) => {
    setInfoFormation((prevInfoFormation) => ({
      ...prevInfoFormation,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCheckboxChange = (e: any) => {
    const newPublicationValue = e.target.checked ? "Oui" : "Non";
    setPub(e.target.checked);
    setInfoFormation((prevInfoFormation) => ({
      ...prevInfoFormation,
      publication: newPublicationValue,
    }));
  };


  const handleSoumissionForm = async (e: any) => {
    e.preventDefault();

    setShowConfirmationDialog(true);
  };

  const confirmerSoumission = async () => {
    setShowConfirmationDialog(false);

    const infoFormationForDatabase = {
      ...infoFormation,
      publication: pub ? "Oui" : "Non",
    };

    try {
      const reponse = await axios.put(`http://localhost:4000/formation/modifier/${code_formation}`, infoFormationForDatabase);

      console.log('Formation mise à jour : ', reponse.data);
      window.history.back();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la formation : `, error);
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

      <form className="formulaire_modif_utilisateur  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[50%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleSoumissionForm}>
        <h2 className="titre_modif_utilisateur">Modification Formation</h2>
        <input
          type="text"
          placeholder='Nom de la formation'
          name="nom_formation"
          value={infoFormation.nom_formation}
          onChange={handleSaisieChangee}
        />

        <label className="w-[80%] h-[40px] p-[8px] bg-white text-gray-400 rounded-[30px]">
          <div className="w-[100%]">
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center text-black">
                Publique:
                <div className="ml-4 w-[20px] h-[20px]">
                  <input
                    className="m-0 p-0"
                    type="checkbox"
                    name="publication"
                    checked={pub}
                    onChange={handleCheckboxChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </label>

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

export default ModifierFormation;



/* <input
  type="number"
  placeholder='Cout de la formation'
  name="cout_formation"
  value={infoFormation.cout_formation}
  onChange={handleSaisieChangee}
/> */