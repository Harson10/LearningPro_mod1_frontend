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
    redirection("/etape");
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
      (etape) => etape.nom_etape.toLowerCase().includes(valeurCherchee)
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

      <h2 className="text-2xl font-bold mb-4">Liste des étapes</h2>
      <div className="flex items-center">
        <table className="min-w-auto bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 py-2 px-4">Module</th>
              <th className="border border-gray-300 py-2 px-4">Nom de l'étape</th>
              <th className="border border-gray-300 py-2 px-4">Texte</th>
              <th className="border border-gray-300 py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="hover:bg-white">
            {etapeTrouvee.map((etape: Etape) => (
              <tr key={etape.num_etape} className="hover:bg-white">
                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{etape.module}</td>
                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{etape.nom_etape}</td>
                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{etape.texte}</td>
                <td className="bg-sky-100 border border-gray-300 py-2 px-4 flex items-center pl-4">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListeEtapeContenu;