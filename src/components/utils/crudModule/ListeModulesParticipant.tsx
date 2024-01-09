import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { FaSearch } from "react-icons/fa";

interface Module {
  code_module: number;
  nom_module: string;
  cout_module: number;
}

const ListeModules: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [modulesTrouve, setModulesTrouve] = useState<Module[]>([]);
  const [chercherCode, setChercherCode] = useState<string>('');

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

  const handleRecherche = (e: ChangeEvent<HTMLInputElement>) => {
    const valeurCherchee = e.target.value.toLowerCase();
    setChercherCode(valeurCherchee);

    const trouve = modules.filter(
      (module) =>
        module.nom_module.toLowerCase().includes(valeurCherchee)
    );
    setModulesTrouve(valeurCherchee ? trouve : modules);
  };

  return (
    <div className="mt-[200px]">
      <div className="">
        <div><h2 className="text-2xl font-bold mb-4 ml-[40%]">Listes des modules</h2></div>
      </div>

      <div className="flex mb-[20px] w-[95%]">
        
        <input
          className="input_recherche w-[250px] ml-[40%]"
          type="text"
          placeholder='Nom de module...'
          value={chercherCode}
          onChange={handleRecherche}
        />

        <FaSearch className="ml-[-50px] mt-[12px] z-10 text-gray-400" />
      </div>

      <div className="w-screen h-auto flex flex-wrap items-center">

        {modulesTrouve.map((module: any) => (
          <div className="shadow-xl w-[30%] h-[100%] rounded-[30px] p-2 bg-white m-[1%]">
            <div className="bg-green-700 w-[100%] h-[20%] m-0 titre_module rounded-[25px] p-2 text-white">
              <div key={module.code_module} className="flex items-center pl-[5%]">
                <div>{module.nom_module}</div>
              </div>
              <div className="bg-white text-center text-gray-700 w-[96%] h-[76%] m-0 contenu_module m-[2%] rounded-[15px]">
                Apprendre { module.nom_module }
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ListeModules;
