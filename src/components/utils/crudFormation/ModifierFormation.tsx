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
    <div className="form_modification_utilisateur">
      <div className="retour_tabBord_modif">
        <button onClick={() => window.history.back()} className="flex p-[13px]">
          <div className="pl-12">Retour</div>
          <div className="p-[3px] pl-4"><FaArrowLeft /></div>
        </button>
      </div>

      <form className="formulaire_modif_utilisateur h-[70%] overflow-hidden" onSubmit={handleSoumissionForm}>
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
              <div className="flex items-center">
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

export default ModifierFormation;



/* <input
  type="number"
  placeholder='Cout de la formation'
  name="cout_formation"
  value={infoFormation.cout_formation}
  onChange={handleSaisieChangee}
/> */