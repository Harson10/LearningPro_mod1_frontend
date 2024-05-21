import React, { useEffect, useState, ChangeEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { FaPencilAlt, FaSearch, FaTrash, FaUserPlus } from "react-icons/fa";
import "../../styles/FormulaireInscription.css";
import { Link } from "react-router-dom";
import Validation from "../../Validation";

interface Utilisateur {
    code_utilisateur: number;
    nom: string;
    prenom: string;
    adresse: string;
    sexe: string;
    profession: string;
    role: string;
}

interface Groupe {
    code_groupe: number;
    nom_groupe: string;
}

interface Participant {
    code_participant: number;
    code_utilisateur: number;
    code_groupe: number;
    dateNaiss: Date;
    lieuNaiss: string;
    numCIN: string;
    nomTuteur: string;
    prenomTuteur: string;
    niveau: string;
    diplome: string;
    utilisateur: Utilisateur;
    groupe: Groupe;
}

const ListesParticipants: React.FC = () => {
    const redirection = useNavigate();
    const [initialUtilisateurs, setInitialUtilisateurs] = useState<Utilisateur[]>([]);
    const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
    const [utilisateursTrouve, setUtilisateursTrouve] = useState<Utilisateur[]>([]);
    const [chercherCode, setChercherCode] = useState<string>('');
    const [participantsMap, setParticipantsMap] = useState<Map<number, Participant>>(new Map());
    const [groupesMap, setGroupesMap] = useState<Map<number, Groupe>>(new Map());
    const [etatConfirmation, setEtatConfirmation] = useState<{
        estOuvert: boolean;
        codeUtilisateurASupprimer: number | null;
    }>({
        estOuvert: false,
        codeUtilisateurASupprimer: null,
    });


    const affichage = async () => {
        try {
            const utilisateursResponse = await axios.get<Utilisateur[]>("http://localhost:4000/utilisateur/role/participants");
            setUtilisateurs(utilisateursResponse.data);

            const participantsResponse = await axios.get<Participant[]>("http://localhost:4000/participant");
            const participantsMap = new Map<number, Participant>();
            participantsResponse.data.forEach((participant) => {
                participantsMap.set(participant.code_utilisateur, participant);
            });

            const groupesResponse = await axios.get<Groupe[]>("http://localhost:4000/groupe");
            const groupesMap = new Map<number, Groupe>();
            groupesResponse.data.forEach((groupe) => {
                groupesMap.set(groupe.code_groupe, groupe);
            });

            const participantsMapData = new Map<number, Participant>();
            participantsResponse.data.forEach((participant) => {
                participantsMapData.set(participant.code_utilisateur, participant);
            });
            setParticipantsMap(participantsMapData);

            const groupesMapData = new Map<number, Groupe>();
            groupesResponse.data.forEach((groupe) => {
                groupesMapData.set(groupe.code_groupe, groupe);
            });
            setGroupesMap(groupesMapData);

            const utilisateursAvecInfos = utilisateursResponse.data.map((utilisateur) => {
                const participant = participantsMap.get(utilisateur.code_utilisateur);
                const groupe = participant ? groupesMap.get(participant.code_groupe) : undefined;

                return {
                    ...utilisateur,
                    participant,
                    groupe,
                };
            });

            setInitialUtilisateurs(utilisateursAvecInfos);
            setUtilisateursTrouve(utilisateursAvecInfos);
        } catch (error) {
            console.error("Erreur lors de la récupération des données :", error);
        }
    };

    useEffect(() => {
        const afficherListes = () => {
            affichage();
        }

        afficherListes();
    }, []);

    const handleInscrireUtilisateur = () => {
        redirection("/inscription-utilisateur/role/participant");
    };

    const handleSupprimerUtilisateur = async (codeUtilisateur: number) => {
        setEtatConfirmation({
            estOuvert: true,
            codeUtilisateurASupprimer: codeUtilisateur,
        });
    };

    const confirmerSuppressionUtilisateur = async (code_utilisateur: number, roleUtilisateur: any) => {
        try {
            if (code_utilisateur) {
                if (roleUtilisateur === "Participant") {
                    const presenceParticipant = async () => {
                        try {
                            await axios.delete(`http://localhost:4000/participant/supprimer/par_utilisateur/${code_utilisateur}`);
                        } catch (error) {
                            console.error("Erreur lors de la suppression du participant :", error);
                        }
                    }

                    await presenceParticipant();
                }
            }
            await axios.delete(`http://localhost:4000/utilisateur/supprimer/${code_utilisateur}`);

            await affichage();
        } catch (error) {
            console.error("Erreur lors de la suppression de l'utilisateur :", error);
        }
    };

    const annulerSuppressionUtilisateur = async () => {
        setEtatConfirmation({
            estOuvert: false,
            codeUtilisateurASupprimer: null,
        });
    };

    const handleRecherche = (e: ChangeEvent<HTMLInputElement>) => {
        const valeurCherchee = e.target.value.toLowerCase();

        if (valeurCherchee === "") {
            // Si la recherche est vide, réinitialisez l'affichage complet
            setChercherCode("");
            setUtilisateursTrouve(initialUtilisateurs);
        } else {
            const utilisateursTrouves = utilisateurs.map((utilisateur) => {
                const participant = participantsMap.get(utilisateur.code_utilisateur);
                const groupe = participant ? groupesMap.get(participant.code_groupe) : undefined;

                return {
                    ...utilisateur,
                    participant,
                    groupe,
                };
            }).filter((utilisateur) =>
                Object.values(utilisateur)
                    .map((value) =>
                        value instanceof Object
                            ? Object.values(value).map((innerValue) => {
                                if (innerValue instanceof Date) {
                                    return innerValue.toLocaleDateString('fr-FR');
                                }
                                return innerValue;
                            })
                            : String(value)
                    )
                    .join(" ")
                    .toLowerCase()
                    .includes(valeurCherchee)
            );

            setChercherCode(valeurCherchee);
            setUtilisateursTrouve(utilisateursTrouves);
        }
    };






    return (
        <div className="w-screen">
            <h2 className="text-2xl font-bold mb-4">Gestion des participants</h2>

            <div className="flex flex-col lg:flex-row mb-5 w-full lg:w-[95%] items-center justify-center">
                <button
                    type="button"
                    className="bg-gradient-to-br from-gray-500 via-gray-400 to-gray-600 bouton_insc_liste w-[250px] rounded-[50px] p-2 mb-5 mr-[50px] lg:mb-0 lg:mr-8"
                    onClick={handleInscrireUtilisateur}
                >
                    <div className="pl-4">Inscrire</div>
                    <div className="pl-2 rounded-full items-center justify-center"><FaUserPlus className="pr-2 w-[30px]" /></div>
                </button>

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

            <div className="table-container overflow-x-auto bottom-0">
                <table className="min-w-full m-[3%] ml-4 bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Role</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Nom</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Prénom</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Adresse</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Sexe</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Profession</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Date de Naissance</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Lieu de Naissance</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Num CIN</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Nom du Tuteur</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Prénom du Tuteur</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Niveau</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Diplôme</th>
                            <th className="border border-gray-300 py-2 px-4 whitespace-nowrap">Groupe</th>
                            <th className="border border-gray-300 whitespace-nowrap">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="hover:bg-white">
                        {utilisateursTrouve.map((utilisateur: any) => (
                            <tr key={utilisateur.code_utilisateur} className="hover:bg-white">
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.role}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.nom}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.prenom}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.adresse}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.sexe}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.profession}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{new Date(utilisateur.participant?.dateNaiss).toLocaleDateString('fr-FR')}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.participant?.lieuNaiss}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.participant?.numCIN}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.participant?.nomTuteur}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.participant?.prenomTuteur}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.participant?.niveau}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">{utilisateur.participant?.diplome}</td>
                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 whitespace-nowrap">
                                    {utilisateur.groupe ? utilisateur.groupe.nom_groupe : "-"}
                                </td>

                                <td className="bg-sky-100 border border-gray-300 py-2 px-4 flex items-center pl-4">
                                    <button
                                        className="bg-gradient-to-br from-green-900 via-green-500 to-green-900 flex text-white border border-white 
                                        py-1 px-2 w-[170px] p-[20px] rounded-[50px] hover:scale-110 mr-4"
                                    >
                                        <div className="pl-6">
                                            <Link to={`/participant/modifier/${utilisateur.code_utilisateur}/${utilisateur.participant?.code_participant}`}>
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
                                        onClick={() => handleSupprimerUtilisateur(utilisateur.code_utilisateur)}
                                    >
                                        <div className="pl-4">Supprimer</div>
                                        <div className="pl-2 pr-2 items-center justify-center mr-2">
                                            <FaTrash className="pr-2 w-[30px] h-[30px] p-[10%]" />
                                        </div>
                                    </button>

                                    <Validation
                                        isOpen={etatConfirmation.estOuvert && etatConfirmation.codeUtilisateurASupprimer === utilisateur.code_utilisateur}
                                        onConfirm={() => {
                                            confirmerSuppressionUtilisateur(utilisateur.code_utilisateur, utilisateur.role);
                                        }}
                                        onCancel={annulerSuppressionUtilisateur}
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

export default ListesParticipants;
