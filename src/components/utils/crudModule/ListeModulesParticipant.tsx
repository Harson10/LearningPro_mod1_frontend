import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router";

interface Module {
  code_module: number;
  nom_module: string;
  cout_module: number;
  formation: string;
}

const ListeModules: React.FC = () => {
  const redirection = useNavigate();
  const [modules, setModules] = useState<Module[]>([]);
  const [modulesTrouve, setModulesTrouve] = useState<Module[]>([]);
  const [chercherCode, setChercherCode] = useState<string>('');
  const code_utilisateur = localStorage.getItem("codeUtilisateur");
  console.log("code_utilisateur: ", code_utilisateur);

  const afficherModules = async () => {
    try {
      const reponse = await axios.get<Module[]>("http://localhost:4000/module/publique");
      setModules(reponse.data);
      setModulesTrouve(reponse.data);
      console.log("resDataTestModule", reponse.data);
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

  const handleAfficherContenu = async (codeFormation: number, codeModule: number) => {
    const code_formation = codeFormation;
    const code_module = codeModule;
    const reponse = await axios.get(`http://localhost:4000/paiement/formation-utilisateur/${code_formation}/${code_utilisateur}`);
    console.log("repAfficherFormationUtilisateur: ", reponse.data);

    if (reponse.data !== 0) {
      redirection(`/module/liste-contenu-participant/${code_module}`);
    } else {
      alert("Vous n'êtes pas inscrit pour ce programme, veuillez contacter votre responsable si besoin.");
    }
  }

  return (
    <div className="mt-[50px]">
      <div className="flex flex-col items-center">
        <div><h2 className="text-2xl font-bold mb-4 ">Listes des modules</h2></div>
      </div>

      <div className="flex flex-col lg:flex-row mb-5 w-full lg:w-[95%] items-center justify-center">
        <div className="flex items-center justify-center w-[250px] mb-5 lg:mb-0 mr-[10px]lg:mr-0">
          <input
            className="input_recherche w-full p-2"
            type="text"
            placeholder="Chercher ..."
            value={chercherCode}
            onChange={handleRecherche}
          />
          <FaSearch className="text-gray-400 ml-[-50px] z-10" />
        </div>
      </div>

      <div className="w-screen h-auto flex flex-wrap items-center">

        {modulesTrouve.map((module: any) => (
          <div className="shadow-xl w-full sm:w-[48%] md:w-[30%] h-auto rounded-[30px] p-2 bg-white m-[3%] lg:m-[1%]">
            <div className="bg-green-700 w-[100%] h-[20%] m-0 titre_module rounded-[25px] p-2 text-white">
              <div key={module.code_module} className="flex items-center pl-[5%]">
                <div>{module.nom_module}</div>
              </div>
              <div className="bg-white text-center text-gray-700 w-[96%] h-[76%] m-0 contenu_module m-[2%] rounded-[15px]">
                Apprendre {module.nom_module}
              </div>

              <div className="pl-[30%] scale-80">
                <button
                  className="bg-gradient-to-br from-gray-600 via-gray-400 to-gray-600 flex text-white border border-white 
                      py-1 px-2 w-[170px] p-[20px] rounded-[50px] hover:scale-105  mr-2"
                  type="button"
                  onClick={() => handleAfficherContenu(module.code_formation, module.code_module)}
                >
                  <div className="pl-6">
                    Afficher
                  </div>
                  <div className="pl-2 items-center justify-center">
                    <FaArrowRight className="pr-2 w-[30px] h-[30px] p-[10%]" />
                  </div>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ListeModules;
