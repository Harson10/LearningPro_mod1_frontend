import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaPencilAlt, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import Validation from "../../Validation";
import { Link } from "react-router-dom";

interface Formation {
  code_formation: number;
  nom_formation: string;
  cout_formation: number;
  publication: string;
}

const ListeFormations: React.FC = () => {
  const [formations, setFormations] = useState<Formation[]>([]);
  const [formationsTrouvees, setFormationsTrouvees] = useState<Formation[]>([]);
  const [chercherNom, setChercherNom] = useState<string>('');
  const redirection = useNavigate();
  const [etatConfirmation, setEtatConfirmation] = useState<{
    estOuvert: boolean;
    codeFormationASupprimer: number | null;
  }>({
    estOuvert: false,
    codeFormationASupprimer: null,
  });

  const afficherFormations: any = async () => {
    try {
      const reponse = await axios.get<Formation[]>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/formation`);
      // const reponse = await axios.get<Formation[]>("http://localhost:4000/formation");
      setFormations(reponse.data);
      setFormationsTrouvees(reponse.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des formations :", error);
    }
  };

  useEffect(() => {
    const affichageF = () => {
      afficherFormations();
    }

    affichageF();
  }, []);

  const handleCreerFormation = () => {
    redirection("/creer-formation");
  }

  const handleSupprimerFormation = async (codeFormation: number) => {
    setEtatConfirmation({
      estOuvert: true,
      codeFormationASupprimer: codeFormation,
    });
  };

  const confirmerSuppressionFormation = async (code_formation: number) => {
    try {
      await axios.delete(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/formation/supprimer/${code_formation}`);
      // await axios.delete(`http://localhost:4000/formation/supprimer/${code_formation}`);

      await afficherFormations();

      setFormations(formations.filter(formation => formation.code_formation !== code_formation));
      setEtatConfirmation({
        estOuvert: false,
        codeFormationASupprimer: null,
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de la formation :", error);
    }
  }

  const annulerSuppressionFormation = async () => {
    setEtatConfirmation({
      estOuvert: false,
      codeFormationASupprimer: null,
    });
  }

  const handleRecherche = (e: ChangeEvent<HTMLInputElement>) => {
    const valeurCherchee = e.target.value.toLowerCase();
    setChercherNom(valeurCherchee);

    const trouvees = formations.filter(
      (formation) =>
        formation.nom_formation.toLowerCase().includes(valeurCherchee) ||
        formation.publication.toLowerCase().includes(valeurCherchee)
    );
    setFormationsTrouvees(valeurCherchee ? trouvees : formations);
  };

  return (
    <div className="w-screen">
      <h2 className="text-2xl font-bold mb-4">Gestion des formations</h2>
      
      <div className="flex flex-col lg:flex-row mb-5 w-full lg:w-[95%] items-center justify-center">
        <button
          type="button"
          className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] rounded-[50px] p-2 mb-5 mr-[50px] lg:mb-0 lg:mr-8"
          onClick={handleCreerFormation}
        >
          <div className="pl-4">Creer</div>
          <div className="pl-2 rounded-full items-center justify-center"><FaPlus className="pr-2 w-[30px]" /></div>
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


      <div className="flex justify-center">
        <div className="table-container overflow-x-auto bottom-0 mx-1/2 translate-y-[-1/2] ">
          <table className="min-w-auto lg:min-w-auto mr-6 ml-4 bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">code</th>
                <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">nom de la formation</th>
                <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">cout</th>
                <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">publication</th>
                <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="hover:bg-white">
              {formationsTrouvees.map((formation: any) => (
                <tr key={formation.code_formation} className="hover:bg-white">
                  <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{formation.code_formation}</td>
                  <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{formation.nom_formation}</td>
                  <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{formation.cout_formation}</td>
                  <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{formation.publication}</td>

                  <td className="bg-sky-100 border border-gray-300 py-2 px-4 flex items-center pl-4">
                    <button
                      className="bg-gradient-to-br from-green-900 via-green-500 to-green-900 flex text-white border border-white 
                      py-1 px-2 w-[170px] p-[20px] rounded-[50px] hover:scale-110 mr-4"
                    >
                      <div className="pl-6">
                        <Link to={`/formation/modifier/${formation.code_formation}`}>
                          Modifier
                        </Link>
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
                        handleSupprimerFormation(formation.code_formation);
                      }}
                    >
                      <div className="pl-4">Supprimer</div>
                      <div className="pl-2 pr-2 items-center justify-center mr-2">
                        <FaTrash className="pr-2 w-[30px] h-[30px] p-[10%]" />
                      </div>
                    </button>

                    <Validation
                      isOpen={etatConfirmation.estOuvert && etatConfirmation.codeFormationASupprimer === formation.code_formation}
                      onConfirm={() => {
                        confirmerSuppressionFormation(formation.code_formation);
                      }}
                      onCancel={annulerSuppressionFormation}
                      message="Êtes-vous sur de vouloir la suppréssion"
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
    </div>
  );
};

export default ListeFormations;
