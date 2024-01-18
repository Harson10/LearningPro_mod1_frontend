import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import "../../styles/FormulaireInscription.css";
import { Link } from "react-router-dom";
import Validation from "../../Validation";
import { FaSearch, FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";

interface Formation {
    code_formation: number;
    cout_formation: number;
    nom_formation: string;
    publication: string
}

interface Participant {
    code_participant: number;
    code_formation: number
}

interface Utilisateur {
    code_utilisateur: number;
    nom: string;
    prenom: string;
}

interface Paiement {
    num_facture: number;
    date_paiement: Date;
    tranche_paiement: number;
    montant: number;
    reste: number;
    transaction_formation: Formation;
    transaction_participant: Participant;
    transaction_utilisateur: Utilisateur;
}

const ListePaiement: React.FC = () => {
    const [paiements, setPaiements] = useState<Paiement[]>([]);
    const [paiementsTrouves, setPaiementsTrouves] = useState<Paiement[]>([]);
    const [chercherFacture, setChercherFacture] = useState<string>("");
    const redirection = useNavigate();
    const [etatConfirmation, setEtatConfirmation] = useState<{
        estOuvert: boolean;
        numFactureASupprimer: number | null;
    }>({
        estOuvert: false,
        numFactureASupprimer: null,
    });

    const afficherPaiements = async () => {
        try {
            const reponse = await axios.get<Paiement[]>("http://localhost:4000/paiement");
            setPaiements(reponse.data);
            setPaiementsTrouves(reponse.data);
            console.log("Paiement:", reponse.data)
        } catch (error) {
            console.error("Erreur lors de la récupération des paiements :", error);
        }
    };

    useEffect(() => {
        const affichage = () => {
            afficherPaiements();
        };
        affichage();
    }, []);

    const handleNouveauPaiement = () => {
        redirection("/nouveau-paiement");
    };

    const handleSupprimerPaiement = async (numFacture: number) => {
        setEtatConfirmation({
            estOuvert: true,
            numFactureASupprimer: numFacture,
        });
    }

    const confirmerSuppressionPaiement = async (num_facture: number) => {
        try {
            await axios.delete(`http://localhost:4000/paiement/supprimer/${num_facture}`);

            await afficherPaiements();

            setPaiements(paiements.filter(paiement => paiement.num_facture !== num_facture));
            setEtatConfirmation({
                estOuvert: false,
                numFactureASupprimer: null,
            });
        } catch (error) {
            console.error("Erreur lors de la suppression du paiement :", error);
        }
    }

    const annulerSuppressionPaiement = async () => {
        setEtatConfirmation({
          estOuvert: false,
          numFactureASupprimer: null,
        });
      }
    
    const handleRecherche = (e: ChangeEvent<HTMLInputElement>) => {
        const valeurCherchee = e.target.value.toLowerCase();
        setChercherFacture(valeurCherchee);

        const trouve = paiements.filter(
            (paiement) =>
                // Ajoutez d'autres critères de recherche selon vos besoin
                paiement.num_facture.toString().includes(valeurCherchee) //||
        );
        setPaiementsTrouves(valeurCherchee ? trouve : paiements);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Gestion des paiements</h2>

            <div className="flex mb-[20px] w-[95%]">
                <button
                    type="button"
                    className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] p-[8px] rounded-[50px]"
                    onClick={handleNouveauPaiement}
                >
                    <div className="pl-4">Nouveau</div>
                    <div className="pl-2 rounded-full items-center justify-center"><FaPlus className="pr-2 w-[30px] h-[30px] p-[10%]" /></div>
                </button>

                <input
                    className="input_recherche w-[250px] ml-[40%]"
                    type="text"
                    placeholder='Chercher ...'
                    value={chercherFacture}
                    onChange={handleRecherche}
                />

                <FaSearch className="ml-[-50px] z-10 text-gray-400" />
            </div>

            <div className="table-container overflow-x-auto sticky bottom-0">
                <table className="min-w-full m-[3%] ml-4 bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">N° Facture</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Date de paiement</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Tranche</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Montant</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Reste</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Formation</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Participant</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Nom</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Prenom</th>
                            <th className="border border-gray-300">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="hover:bg-white">
                        {paiementsTrouves.map((paiement: any) => (
                            <tr key={paiement.num_facture} className="hover:bg-white">
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.num_facture}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{new Date(paiement.date_paiement).toLocaleDateString('fr-FR')}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.tranche_paiement}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.montant}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.reste}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.transaction_formation.nom_formation}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.transaction_participant.code_participant}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.transaction_utilisateur.nom}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4">{paiement.transaction_utilisateur.prenom}</td>

                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 flex items-center pl-4">
                                    <button
                                        className="bg-gradient-to-br from-green-900 via-green-500 to-green-900 flex text-white border border-white 
                                                    py-1 px-2 w-[170px] p-[20px] rounded-[50px] hover:scale-110  mr-4"
                                    >
                                        <div className="pl-6">
                                            <Link to={`/paiement/modifier/${paiement.num_facture}`}>
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
                                        onClick={() => handleSupprimerPaiement(paiement.num_facture)}
                                    >
                                        <div className="pl-4">Supprimer</div>
                                        <div className="pl-2 pr-2 items-center justify-center mr-2">
                                            <FaTrash className="pr-2 w-[30px] h-[30px] p-[10%]" />
                                        </div>
                                    </button>

                                    <Validation
                                        isOpen={etatConfirmation.estOuvert && etatConfirmation.numFactureASupprimer === paiement.num_facture}
                                        onConfirm={() => {
                                            confirmerSuppressionPaiement(paiement.num_facture);
                                        }}
                                        onCancel={annulerSuppressionPaiement}
                                        message="Êtes-vous sûr de vouloir continuer la suppression ?"
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

export default ListePaiement;