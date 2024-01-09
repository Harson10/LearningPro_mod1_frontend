import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaPencilAlt, FaSearch, FaTrash, FaUserPlus } from "react-icons/fa";
import "../../styles/FormulaireInscription.css";
import { Link } from "react-router-dom";
import Validation from "../../Validation";


interface Groupe {
    code_groupe: number;
    nom_groupe: string;
}


const ListGroupe: React.FC = () => {
    const [groupes, setGroupes] = useState<Groupe[]>([]);
    const [groupeTrouve, setGroupeTrouve] = useState<Groupe[]>([]);
    const [chercherCode, setChercherCode] = useState<string>('');
    const redirection = useNavigate();
    const [etatConfirmation, setEtatConfirmation] = useState<{
      estOuvert: boolean;
      codeGroupeASupprimer: number | null;
    }>({
      estOuvert: false,
      codeGroupeASupprimer: null,
    });

    const afficherGroupe = async () => {
        try {
            const reponse = await axios.get<Groupe[]>("http://localhost:4000/groupe");
            setGroupes(reponse.data);
            setGroupeTrouve(reponse.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des groupe :", error);
        }
    };

    useEffect(() => {
        const affichage = () => {
            afficherGroupe();
        }
        affichage();
    }, []);

    const handleInscrireGroupe = () => {
        redirection("/groupe");
    }

    const handleSupprimerGroupe = async (codeGroupe: number) => {
        setEtatConfirmation({
          estOuvert: true,
          codeGroupeASupprimer: codeGroupe,
        });
    }

    const confirmerSuppressionGroupe = async (code_groupe: number) => {
        try {
            await axios.delete(`http://localhost:4000/groupe/supprimer/${code_groupe}`);
            await afficherGroupe();
            setGroupes(groupes.filter(groupe => groupe.code_groupe !== code_groupe));
            setEtatConfirmation({
                estOuvert: false,
                codeGroupeASupprimer: null,
              });
            
        } catch (error) {
            console.error("Erreur lors de la suppression du Groupe :", error);
        }
    };

    const annulerSuppressionGroupe = async () => {
        setEtatConfirmation({
            estOuvert: false,
            codeGroupeASupprimer: null,
        })
    }


    const handleRecherche = (e: ChangeEvent<HTMLInputElement>) => {
        const valeurCherchee = e.target.value.toLowerCase();
        setChercherCode(valeurCherchee);

        const trouve = groupes.filter(
            (groupe) =>
            groupe.nom_groupe.toLowerCase().includes(valeurCherchee)

        );
        setGroupeTrouve(valeurCherchee ? trouve : groupes);
    };




    return (
        <div>
            <div className="flex">
                <button
                    type="button"
                    className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] p-[8px] rounded-[50px]"
                    onClick={handleInscrireGroupe}
                >
                    <div className="pl-4">Creer un groupe</div>
                    <div className="pl-2 rounded-full items-center justify-center"><FaUserPlus className="pr-2 w-[30px] h-[30px] p-[10%]" /></div>
                </button>

                <input
                    className="input_recherche w-[250px] ml-[40%]"
                    type="text"
                    placeholder='Chercher ...'
                    value={chercherCode}
                    onChange={handleRecherche}
                />

                <FaSearch className="ml-[-50px] z-10 text-gray-400" />
            </div>

            <h2 className="text-2xl font-bold mb-4">Liste des groupe</h2>
            <div className="flex items-center">
                <table className="min-w-auto bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 py-2 px-4">code</th>
                            <th className="border border-gray-300 py-2 px-4">nom groupe</th>
                            <th className="border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="hover:bg-white">
                        {groupeTrouve.map((groupe: any) => (
                            <tr key={groupe.code_groupe} className="hover:bg-white">
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{groupe.code_groupe}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{groupe.nom_groupe}</td>

                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 flex items-center pl-4">
                                    <button
                                        className="bg-gradient-to-br from-green-900 via-green-500 to-green-900 flex text-white border border-white 
                                            py-1 px-2 w-[170px] p-[20px] rounded-[50px] hover:scale-110 mr-4"
                                    >
                                        <div className="pl-6">
                                            <Link to={`/groupe/modifier/${groupe.code_groupe}`}>
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
                                        onClick={() => {handleSupprimerGroupe(groupe.code_groupe);
                                        }}
                                    >
                                        <div className="pl-4">Supprimer</div>
                                        <div className="pl-2 pr-2 items-center justify-center mr-2">
                                            <FaTrash className="pr-2 w-[30px] h-[30px] p-[10%]" />
                                        </div>
                                    </button>

                                    <Validation 
                                        isOpen={etatConfirmation.estOuvert && etatConfirmation.codeGroupeASupprimer === groupe.code_groupe}
                                        onConfirm={() => {
                                            confirmerSuppressionGroupe(groupe.code_groupe);
                                        }}
                                        onCancel={annulerSuppressionGroupe}
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
    );
};

export default ListGroupe;
