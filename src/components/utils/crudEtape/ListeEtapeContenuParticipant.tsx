import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { FaArrowLeft, FaSearch } from "react-icons/fa";
import { useParams } from "react-router-dom";
import PDFViewer from "../PDFViewer";

interface Etape {
  num_etape: number;
  nom_etape: string;
  texte: string;
  code_module: string;
  module: string;
  pdf: string;
  // pdf_path: string;
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

  console.log('Étapes chargées :', etapes);

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

      <div className="flex flex-col lg:flex-row mb-5 w-full lg:w-[95%] items-center justify-center">

        <button
          type="button"
          className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] rounded-[50px] p-2 mb-5 mr-[50px] lg:mb-0 lg:mr-8"
          onClick={() => { window.history.back() }}
        >
          <div className="pl-4">Retour</div>
          <div className="pl-2 rounded-full items-center justify-center">
            <FaArrowLeft className="pr-2 w-[30px] h-[30px] p-[10%]" />
          </div>
        </button>

        <div className="flex items-center justify-center w-[250px] mb-5 lg:mb-0 mr-[10px]lg:mr-0">
          <input
            className="input_recherche w-full p-2"
            type="text"
            placeholder="Chercher ..."
            value={chercherNom}
            onChange={handleRecherche}
          />
          <FaSearch className="text-gray-400 ml-[-50px] z-10" />
        </div>
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

              {etape.pdf && (
                // {etape.pdf_path && (
                <div className="bg-white text-gray-700 w-[96%] h-[76%] m-[2%]">
                  <PDFViewer pdfUrl={`http://localhost:4000/${etape.pdf}`} />
                  {/* <PDFViewer pdfUrl={`http://localhost:4000/${etape.pdf_path}`} /> */}
                </div>
              )}

            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default ListeEtapeContenuParticipant;