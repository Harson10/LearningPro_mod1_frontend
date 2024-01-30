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
  const [nom_etape, setNomEtape] = useState("");
  const [texte, setTexte] = useState("");
  const [popupStyle, setPopupStyle] = useState<string>("hide");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  useEffect(() => {
    // Récupérer les formations
    axios.get<Module[]>('http://localhost:4000/module/')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setModules(response.data);
          setChoixModule(String(response.data[0]?.code_module || ""));
        } else {
          console.error('Données sur les modules non disponibles');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données sur les modules');
      });
  }, []);

  const handleCreerEtape = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setShowConfirmationDialog(true);
  };

  const confirmerCreationEtape = async () => {

    setShowConfirmationDialog(false);

    const nouvelleEtape = {
      nom_etape: nom_etape,
      texte: texte,
      code_module: choixModule
    };

    try {

      const response = await axios.post('http://localhost:4000/etape/creer', nouvelleEtape);
      console.log('Etape créé avec succès', response.data);

    } catch (error) {
      setPopupStyle("popup_connexion");
      setTimeout(() => setPopupStyle("hide"), 3000);
      console.log('Erreur lors de la création du module', error);
    }
    window.history.back()
  }

  const annulerCreationEtape = async () => {
    setShowConfirmationDialog(false);
  }

  return (
    <div className="form_inscription">

            <div className="retour_tabBord" onClick={() => window.history.back()} >
                <button className="flex p-[13px]">
                    <div className="pl-12">Retour</div>
                    <div className="p-[3px] pl-4"><FaArrowLeft /></div>
                </button>
            </div>


            <div className={popupStyle}>
                <h3>La création est un echec!!</h3>
                <p>Erreur lors de la création</p>
            </div>

            <form className="formulaireInscription w-[35%] h-[80%] overflow-hidden" onSubmit={handleCreerEtape}>
                <h2 className="titre_inscription">Publication</h2>
                
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

                <div className="w-[80%] h-auto p-[8px] flex flex-center b_inscription">
                    <button type="submit" className="flex items-center">
                        <div className="pl-4">Créer</div>
                        <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
                    </button>
                </div>
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
  )
}

export default AjoutEtapeContenu;