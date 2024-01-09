import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaPencilAlt, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import "../../styles/FormulaireInscription.css";
import { Link } from "react-router-dom";
import Validation from "../../Validation";

// interface Formation {
//   code_formation: number;
//   nom_formation: string;
//   coup_formation: number;
//   publication: string;
// }

interface Module {
  code_module: number;
  nom_module: string;
  cout_module: number;
  formation: string;
}

const ListeModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [modulesTrouve, setModulesTrouve] = useState<Module[]>([]);
  const [chercherCode, setChercherCode] = useState<string>('');
  const redirection = useNavigate();
  const [etatConfirmation, setEtatConfirmation] = useState<{
    estOuvert: boolean;
    codeModuleASupprimer: number | null;
  }>({
    estOuvert: false,
    codeModuleASupprimer: null,
  });

  const afficherModules = async () => {
    try {
      const reponse = await axios.get<Module[]>("http://localhost:4000/module");
      setModules(reponse.data);
      setModulesTrouve(reponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des modules :", error);
    }
  };

  useEffect(() => {
    const affichage = () => {
      afficherModules();
    }
    affichage();
  }, []);

  const handleCreerModule = () => {
    redirection("/creer-module");
  }

  const handleSupprimerModule = async (codeModule: number) => {
    setEtatConfirmation({
      estOuvert: true,
      codeModuleASupprimer: codeModule,
    });
  };

  const confirmerSuppressionModule = async (code_module: number) => {
    try {
      if (code_module) {
        const presenceEtape = await axios.get(`http://localhost:4000/etape/rapporter_par_module/${code_module}`);
        console.log('presenceEtape: ', presenceEtape.data);
        const pEtape = presenceEtape.data;

        if (pEtape !== 0) {
          await axios.delete(`http://localhost:4000/etape/supprimer/par_module/${code_module}`);
        }
      }
      await axios.delete(`http://localhost:4000/module/supprimer/${code_module}`);

      await afficherModules();

      setModules(modules.filter(module => module.code_module !== code_module));
      setEtatConfirmation({
        estOuvert: false,
        codeModuleASupprimer: null,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression du module :", error);
    }
  }

  const annulerSuppressionModule = async () => {
    setEtatConfirmation({
      estOuvert: false,
      codeModuleASupprimer: null,
    });
  }

  const handleRecherche = (e: ChangeEvent<HTMLInputElement>) => {
    const valeurCherchee = e.target.value.toLowerCase();
    setChercherCode(valeurCherchee);

    const trouve = modules.filter(
      (module) =>
        module.nom_module.toLowerCase().includes(valeurCherchee) ||
        module.formation.toLowerCase().includes(valeurCherchee)
    );
    setModulesTrouve(valeurCherchee ? trouve : modules);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Gestion des modules</h2>

      <div className="flex mb-[20px] w-[95%]">
        <button
          type="button"
          className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] p-[8px] rounded-[50px]"
          onClick={handleCreerModule}
        >
          <div className="pl-4">Creer</div>
          <div className="pl-2 rounded-full items-center justify-center"><FaPlus className="pr-2 w-[30px] h-[30px] p-[10%]" /></div>
        </button>

        <input
          className="input_recherche w-[250px] ml-[40%]"
          type="text"
          placeholder='Nom de module...'
          value={chercherCode}
          onChange={handleRecherche}
        />

        <FaSearch className="ml-[-50px] z-10 text-gray-400" />
      </div>

      <div className="w-screen h-auto flex flex-wrap items-center">

        {modulesTrouve.map((module: any) => (
          <div className="shadow-xl w-[30%] h-[100%] rounded-[30px] p-2 bg-white m-[1%]">
            <div className="bg-green-700 w-[100%] h-[20%] m-0 titre_module rounded-[25px] p-2 text-white">
              <div key={module.code_module} className="flex items-center">
                <div className="p-4">{module.nom_module} </div> | <div className="p-4">{module.cout_module} Ar</div>
              </div>

              <div className="bg-white text-gray-700 w-[96%] h-[76%] m-0 contenu_module m-[2%]">
                Formation : {module.formation}
              </div>

              <div className="bg-white text-gray-700 w-[96%] h-[76%] m-0 contenu_module m-[2%]">
                Apprendre {module.nom_module}
              </div>

              <div className="flex flex-center scale-80">
                <button
                  className="bg-gradient-to-br from-green-900 via-green-500 to-green-900 flex text-white border border-white 
                      py-1 px-2 w-[170px] p-[20px] rounded-[50px] hover:scale-105  mr-2"
                >
                  <div className="pl-6">
                    <Link to={`/module/modifier/${module.code_module}`}>
                      Modifier
                    </Link>
                  </div>
                  <div className="pl-2 items-center justify-center">
                    <FaPencilAlt className="pr-2 w-[30px] h-[30px] p-[10%]" />
                  </div>
                </button>

                <button
                  className="bg-gradient-to-br from-red-900 via-red-500 to-red-900 flex text-white border border-white 
                      py-1 px-2 w-[170px] rounded-[50px] hover:scale-105"
                  type="button"
                  onClick={() => handleSupprimerModule(module.code_module)}
                >
                  <div className="pl-4">Supprimer</div>
                  <div className="pl-2 pr-2 items-center justify-center mr-2">
                    <FaTrash className="pr-2 w-[30px] h-[30px] p-[10%]" />
                  </div>
                </button>
              </div>
            </div>

            <Validation
              isOpen={etatConfirmation.estOuvert && etatConfirmation.codeModuleASupprimer === module.code_module}
              onConfirm={() => {
                confirmerSuppressionModule(module.code_module);
              }}
              onCancel={annulerSuppressionModule}
              message="Êtes-vous sûr de vouloir continuer la suppression ?"
              bg_modal_show="bg-white shadow-sm"
              style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-red-500 hover:text-white"
              style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
            />
          </div>
        ))}
      </div>

    </div>
  );
};

export default ListeModules;
