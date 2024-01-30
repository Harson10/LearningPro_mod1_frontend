import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { FaPencilAlt, FaSearch, FaTrash, FaUserPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Validation from "../../Validation";

interface Etape {
  num_etape: number;
  nom_etape: string;
  texte: string;
  code_module: number;
  module: string;
}

const ListeEtapeContenu: React.FC = () => {
  const [etapes, setEtapes] = useState<Etape[]>([]);
  const [etapeTrouvee, setEtapeTrouvee] = useState<Etape[]>([]);
  const [chercherNom, setChercherNom] = useState<string>("");
  const redirection = useNavigate();
  const [etatConfirmation, setEtatConfirmation] = useState<{
    estOuvert: boolean;
    numEtapeASupprimer: number | null;
  }>({
    estOuvert: false,
    numEtapeASupprimer: null,
  });

  const afficherEtapes = async () => {
    try {
      const reponse = await axios.get<Etape[]>("http://localhost:4000/etape");
      console.log("res.data:", reponse.data);
      setEtapes(reponse.data);
      setEtapeTrouvee(reponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des étapes :", error);
    }
  };

  useEffect(() => {
    afficherEtapes();
  }, []);

  const handleCreerEtape = () => {
    redirection("/creer-etape");
  };

  const handleSupprimerEtape = async (num_etape: number) => {
    setEtatConfirmation({
      estOuvert: true,
      numEtapeASupprimer: num_etape,
    });
  };

  const confirmerSuppressionEtape = async (num_etape: number) => {
    try {
      await axios.delete(`http://localhost:4000/etape/supprimer/${num_etape}`);
      await afficherEtapes();
      setEtapes(etapes.filter((etape) => etape.num_etape !== num_etape));
      setEtatConfirmation({
        estOuvert: false,
        numEtapeASupprimer: null,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'étape :", error);
    }
  };

  const annulerSuppressionEtape = () => {
    setEtatConfirmation({
      estOuvert: false,
      numEtapeASupprimer: null,
    });
  };

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
    <div>
      <div className="flex">
        <button
          type="button"
          className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] p-[8px] rounded-[50px]"
          onClick={handleCreerEtape}
        >
          <div className="pl-4">Créer une étape</div>
          <div className="pl-2 rounded-full items-center justify-center">
            <FaUserPlus className="pr-2 w-[30px] h-[30px] p-[10%]" />
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

              <div className="bg-white text-gray-700 w-[96%] h-[76%] m-[2%]">
                {etape.texte}
              </div>

              <div className="flex flex-center scale-80">
                <button
                  className="bg-gradient-to-br from-green-900 via-green-500 to-green-900 flex text-white border border-white 
                      py-1 px-2 w-[170px] p-[20px] rounded-[50px] hover:scale-110 mr-4"
                >
                  <div className="pl-6">
                    <Link to={`/etape/modifier/${etape.num_etape}`}>Modifier</Link>
                  </div>
                  <div className="pl-2 items-center justify-center">
                    <FaPencilAlt className="pr-2 w-[30px] h-[30px] p-[10%]" />
                  </div>
                </button>

                <button
                  className="bg-gradient-to-br from-red-900 via-red-500 to-red-900 flex text-white border border-white 
                      py-1 px-2 w-[170px] rounded-[50px] hover:scale-110"
                  type="button"
                  onClick={() => {
                    handleSupprimerEtape(etape.num_etape);
                  }}
                >
                  <div className="pl-4">Supprimer</div>
                  <div className="pl-2 pr-2 items-center justify-center mr-2">
                    <FaTrash className="pr-2 w-[30px] h-[30px] p-[10%]" />
                  </div>
                </button>
              </div>
            </div>
            
            <Validation
                isOpen={etatConfirmation.estOuvert && etatConfirmation.numEtapeASupprimer === etape.num_etape}
                onConfirm={() => {
                  confirmerSuppressionEtape(etape.num_etape);
                }}
                onCancel={annulerSuppressionEtape}
                message="Êtes-vous sûr de vouloir la suppression"
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

export default ListeEtapeContenu;