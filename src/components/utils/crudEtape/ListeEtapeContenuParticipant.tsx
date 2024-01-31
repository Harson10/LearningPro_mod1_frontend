import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import {  useParams } from "react-router-dom";

interface Etape {
  num_etape: number;
  nom_etape: string;
  texte: string;
  code_module: string;
  module: string;
}

const ListeEtapeContenuParticipant: React.FC = () => {
  const { code_module } = useParams();
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [etapeTrouvee, setEtapeTrouvee] = useState<Etape[]>([]);
  const [chercherNom, setChercherNom] = useState<string>("");

  const afficherEtapes = async (codeModule: any) => {
    const code_module = parseInt(codeModule);
    try {
      const reponse = await axios.get<Etape[]>(`http://localhost:4000/etape/rapporter_par_module/${code_module}`);
      console.log("res.data:", reponse.data);
      setEtapes(reponse.data);
      setEtapeTrouvee(reponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des étapes :", error);
    }
  };

  useEffect(() => {
    const affichage = async () => {
      await afficherEtapes(code_module);
    }
    affichage();
  }, [code_module]);

  const handleRecherche = (e: ChangeEvent<HTMLInputElement>) => {
    const valeurCherchee = e.target.value.toLowerCase();
    setChercherNom(valeurCherchee);

    const trouve = etapes.filter(
      (etape) =>
        etape.nom_etape.toLowerCase().includes(valeurCherchee) ||
        etape.module.toLowerCase().includes(valeurCherchee) ||
        etape.texte.toLowerCase().includes(valeurCherchee)
    );
    setEtapeTrouvee(valeurCherchee ? trouve : etapes);
  };

  return (
    <div className="pt-[50px]">

      <div className="flex">
        <button
          type="button"
          className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] p-[8px] rounded-[50px]"
          onClick={() => { window.history.back() }}
        >
          <div className="pl-4">Retour</div>
          <div className="pl-2 rounded-full items-center justify-center">
            <FaArrowLeft className="pr-2 w-[30px] h-[30px] p-[10%]" />
          </div>
        </button>

        <input
          className="input_recherche w-[250px] ml-[40%]"
          type="text"
          placeholder="Chercher ..."
          value={chercherNom}
          onChange={handleRecherche}
        />

        <FaSearch className="ml-[-50px] z-10 text-gray-400" />
      </div>

      <h2 className="text-2xl font-bold mb-4">Publications</h2>

      <div className="flex flex-wrap mb-[20px] w-[95%] w-screen h-auto">

        {etapeTrouvee.map((etape: Etape) => (
          <div className="shadow-xl w-[80%] h-[100%] rounded-[30px] p-2 bg-white m-[1%]">
            <div className="bg-green-700 w-[100%] h-[20%] m-0 rounded-[25px] p-2 text-white">

              <div key={etape.num_etape} className="flex items-center">
                <div className="p-4">Module: {etape.module}</div>
              </div>

              <div className="bg-white text-gray-700 w-[96%] h-[76%] contenu_module m-[2%]">
                Titre: {etape.nom_etape}
              </div>

              <div className="bg-white text-left text-gray-700 w-[96%] h-[76%] m-[2%]">
                {etape.texte}
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeEtapeContenuParticipant;