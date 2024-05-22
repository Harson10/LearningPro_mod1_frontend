import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/Form_Modif_Utilisateur.css";
import { useParams } from "react-router";
import { FaArrowLeft, FaSave } from "react-icons/fa";
import Validation from "../../Validation";

const ModifierEtapeContenu: React.FC = () => {
  const { num_etape } = useParams();
  const [module, setModule] = useState("");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
  const [infoEtape, setInfoEtape] = useState({
    nom_etape: "",
    texte: "",
    pdf_path: "", // Ajout du champ pdf_path
  });
  const [pdfFile, setPdfFile] = useState<File | null>(null);

  useEffect(() => {
    const afficherEtape = async () => {
      try {
        const reponse = await axios.get(`http://localhost:4000/etape/${num_etape}`);
        const Etape = reponse.data;
        setInfoEtape({
          nom_etape: Etape.nom_etape,
          texte: Etape.texte,
          pdf_path: Etape.pdf_path, // Ajout de pdf_path
        });
        const code_module = reponse.data.code_module;
        const reponseModule = await axios.get(`http://localhost:4000/module/${code_module}`);
        setModule(reponseModule.data.nom_module);
      } catch (error) {
        console.error(`Erreur lors de la récupération du module : `, error);
      }
    };
    afficherEtape();
  }, [num_etape]);

  const handleSaisieChangee = (e: any) => {
    const { name, value } = e.target;
    setInfoEtape((prevInfoEtape) => ({
      ...prevInfoEtape,
      [name]: value,
    }));
  };

  const handleSoumissionForm = async (e: any) => {
    e.preventDefault();

    setShowConfirmationDialog(true);
  };

  const confirmerSoumission = async () => {
    setShowConfirmationDialog(false);
    try {
      const formData = new FormData();
      formData.append("nom_etape", infoEtape.nom_etape);
      formData.append("texte", infoEtape.texte);
      if (pdfFile) {
        formData.append("pdf_path", pdfFile, pdfFile.name);
      }
      const reponse = await axios.put(`http://localhost:4000/etape/modifier/${num_etape}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Etape mis à jour : ', reponse.data);
      window.history.back();
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'etape : `, error);
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
        <h2 className="titre_modif_utilisateur">Publication</h2>
        <input
          type="text"
          placeholder='Module'
          name="module"
          value={module}
          readOnly
        />
        <input
          type="text"
          placeholder='Titre'
          name="nom_etape"
          value={infoEtape.nom_etape}
          onChange={handleSaisieChangee}
        />
        <textarea
          className="w-[70%]"
          placeholder='Texte ...'
          name="texte"
          value={infoEtape.texte}
          onChange={handleSaisieChangee}
        />
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
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
  )
}

export default ModifierEtapeContenu;
