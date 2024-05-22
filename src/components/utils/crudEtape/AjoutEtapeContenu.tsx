
// export default AjoutEtapeContenu;

import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Validation from "../../Validation";

interface Module {
  code_module: number;
  code_formation: number;
  nom_module: string;
}

const AjoutEtapeContenu: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [choixModule, setChoixModule] = useState<string>("");
  const [nom_etape, setNomEtape] = useState<string>("");
  const [texte, setTexte] = useState<string>("");
  const [pdfFile, setPdfFile] = useState<File | null>(null);  // Nouvelle état pour le fichier PDF
  const [popupStyle, setPopupStyle] = useState<string>("hide");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState<boolean>(false);

  useEffect(() => {
    axios.get<Module[]>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/module/`)
    // axios.get<Module[]>('http://localhost:4000/module/')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setModules(response.data);
          setChoixModule(String(response.data[0]?.code_module || ""));
        } else {
          console.error('Données sur les modules non disponibles');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données sur les modules', error);
      });
  }, []);

  const handleCreerEtape = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmationDialog(true);
  };

  const confirmerCreationEtape = async () => {
    setShowConfirmationDialog(false);

    const formData = new FormData();
    formData.append("nom_etape", nom_etape);
    formData.append("texte", texte);
    formData.append("code_module", choixModule);
    if (pdfFile) {
      formData.append("pdf_path", pdfFile);
    }

    try {
      const response = await axios.post(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/etape/creer`, formData, {
        // const response = await axios.post('http://localhost:4000/etape/creer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Etape créé avec succès', response.data);
    } catch (error) {
      setPopupStyle("popup_connexion");
      setTimeout(() => setPopupStyle("hide"), 3000);
      console.log('Erreur lors de la création du module', error);
    }
    window.history.back();
  };

  const annulerCreationEtape = () => {
    setShowConfirmationDialog(false);
  };

  return (

    <div className="form_inscription relative w-screen h-screen box-border m-0 pb-8 text-center justify-center bg-cover bg-fixed bg-no-repeat bg-center font-sans overflow-y-scroll">

      <div className="relative w-full h-[10%]" onClick={() => window.history.back()} >
        <div className="flex relative w-full z-20">
          <button className="retour_acceuil absolute px-0 w-[180px] top-[9px] left-[10px] h-[35px] lg:px-8 lg:w-[250px] lg:top-[12.25px] lg:left-[30px] lg:h-[50px] rounded-[30px] text-white font-bold shadow-md shadow-gray-700 border-2 border-white flex items-center hover:bg-green-700">
            <div className="pl-4">Retour</div>
            <div className="p-[4px] pl-3"><FaArrowLeft /></div>
          </button>
        </div>
      </div>

      <div className={popupStyle}>
        <h3>La création est un echec!!</h3>
        <p>Erreur lors de la création</p>
      </div>

      <form className="formulaireInscription  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[60%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleCreerEtape}>
        <h2 className="titre_inscription text-center">Publication</h2>

        <select
          className="w-[60%] text-center rounded-[50px] p-[5px]"
          value={choixModule}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChoixModule(e.target.value)}
        >

          <option key="default" value="">
            Choisir le module
          </option>
          {modules.map((module) => (
            <option key={module.code_module} value={module.code_module}>
              {module.nom_module}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder='Titre*'
          value={nom_etape}
          onChange={(e) => setNomEtape(e.target.value)}
        />
        <textarea
          className="w-[75%]"
          placeholder='Texte*'
          value={texte}
          onChange={(e) => setTexte(e.target.value)}
        />
        <input
          className="w-[75%] px-[10%] py-1 border rounded-md focus:outline-none focus:border-blue-500"
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
        />

        <button type="submit" className="boutton_modification_utilisateur cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]">
          <div className="pl-4">Créer</div>
          <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
        </button>

      </form>

      <Validation
        isOpen={showConfirmationDialog}
        onConfirm={confirmerCreationEtape}
        onCancel={annulerCreationEtape}
        message="Confirmer la création de ce contenu ?"
        bg_modal_show="bg-white shadow-sm"
        style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
        style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
      />

    </div>

  );
};

export default AjoutEtapeContenu;
