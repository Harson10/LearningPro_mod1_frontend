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
    <div className="form_modification_utilisateur">
      <div className="retour_tabBord_modif">
        <button onClick={() => window.history.back()} className="flex p-[13px]">
          <div className="pl-12">Retour</div>
          <div className="p-[3px] pl-4"><FaArrowLeft /></div>
        </button>
      </div>

      <form className="formulaire_modif_utilisateur h-[80%] overflow-hidden" onSubmit={handleSoumissionForm}>
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
  )
}

export default ModifierEtapeContenu;
