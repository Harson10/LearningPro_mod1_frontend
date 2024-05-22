import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/InfoSuppParticipant.css";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Validation from "../../Validation";


interface Groupe {
    code_groupe: number;
    nom_groupe: string;
}

const InfoSuppParticipant: React.FC = () => {
    const [groupes, setGroupes] = useState<Groupe[]>([]);
    const [choixGroupe, setChoixGroupe] = useState<string>("");
    const [dateNaiss, setDateNaiss] = useState("");
    const [lieuNaiss, setLieuNaiss] = useState("");
    const [numCIN, setNumCIN] = useState("");
    const [nomTuteur, setNomTuteur] = useState("");
    const [prenomTuteur, setPrenomTuteur] = useState("");
    const [niveau, setNiveau] = useState("");
    const [diplome, setDiplome] = useState("");
    const [popupStyle, setPopupStyle] = useState<string>("hide");
    const [dernierCodeUtilisateur, setDernierCodeUtilisateur] = useState<number | null>(null);
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    useEffect(() => {
        // Récupérer le dernier utilisateur créé lors du montage du composant
        axios.post<number>('http://localhost:4000/utilisateur/dernier_utilisateur')
            .then(response => {
                if (response.data) {
                    console.log(response.data);
                    setDernierCodeUtilisateur(response.data);
                } else {
                    console.error('Code utilisateur du dernier utilisateur non disponible');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération du code utilisateur du dernier utilisateur');
            });

        // Récupérer les groupes
        axios.get<Groupe[]>('http://localhost:4000/groupe/')
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    setGroupes(response.data);
                    setChoixGroupe(String(response.data[0]?.code_groupe || ""));
                } else {
                    console.error('Données sur les groupes non disponibles');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données sur les groupes');
            });
    }, []);

    const handleAjoutInfoParticipant = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setShowConfirmationDialog(true);
    };

    const confirmerAjoutInfoParticipant = async () => {
        setShowConfirmationDialog(false);

        const nouveauParticipant = {
            dateNaiss: dateNaiss,
            lieuNaiss: lieuNaiss,
            numCIN: numCIN,
            nomTuteur: nomTuteur,
            prenomTuteur: prenomTuteur,
            niveau: niveau,
            diplome: diplome,
            code_groupe: choixGroupe,
            code_utilisateur: dernierCodeUtilisateur
        };

        try {
            const reponse = await axios.post('http://localhost:4000/participant/creer/', nouveauParticipant);
            console.log('Participant bien créé avec succès', reponse.data);
            window.history.back();
            window.history.back();
        } catch (error) {
            setPopupStyle("popup_connexion");
            setTimeout(() => setPopupStyle("hide"), 3000);
            console.error("Erreur lors de l'ajout d'information supplémentaire:", error);
        }
    }

    const annulerAjoutInfoParticipant = async () => {
        setShowConfirmationDialog(false);
    }

    return (
        <div className="form_info_supp  relative w-screen h-screen box-border m-0 pb-8 text-center justify-center bg-cover bg-fixed bg-no-repeat bg-center font-sans overflow-y-scroll">

            <div className="relative w-full h-[10%]" onClick={() => {
                window.history.back();
                const code_utilisateur = dernierCodeUtilisateur;
                axios.delete(`http://localhost:4000/utilisateur/supprimer/${code_utilisateur}`);
            }}>
                <div className="flex relative w-full z-20">
                    <button className="retour absolute px-0 w-[180px] top-[9px] left-[10px] h-[35px] lg:px-8 lg:w-[250px] lg:top-[12.25px] lg:left-[30px] lg:h-[50px] rounded-[30px] text-white font-bold shadow-md shadow-gray-700 border-2 border-white flex items-center hover:bg-green-700">
                        <div className="pl-12">Retour</div>
                        <div className="p-[3px] pl-4"><FaArrowLeft /></div>
                    </button>
                </div>
            </div>

            <div className={popupStyle}>
                <h3>L'ajout d'information supplémentaire est un échec!!</h3>
                <p>Erreur lors de la création</p>
            </div>

            <form className="formulaireParticipant absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[100%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleAjoutInfoParticipant}>
                <h1 className="titre_info">Participant</h1>
                <h1 className="text-xl">Informations supplémentaires</h1>

                <div className="z-20">
                    <DatePicker
                        selected={dateNaiss ? new Date(dateNaiss) : null}
                        onChange={(date: Date) => setDateNaiss(date.toISOString().split('T')[0])}
                        placeholderText="Date de naissance"
                        dateFormat="dd-MM-yyyy"
                        className=" border p-2"
                        calendarClassName="border border-sky-300 p-2"
                    />
                </div>

                <input
                    type="text"
                    placeholder="Lieu de naissance"
                    value={lieuNaiss}
                    onChange={(e) => setLieuNaiss(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Numéro de CIN"
                    value={numCIN}
                    onChange={(e) => setNumCIN(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Nom du tuteur"
                    value={nomTuteur}
                    onChange={(e) => setNomTuteur(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Prénom du tuteur"
                    value={prenomTuteur}
                    onChange={(e) => setPrenomTuteur(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Niveau"
                    value={niveau}
                    onChange={(e) => setNiveau(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Diplôme"
                    value={diplome}
                    onChange={(e) => setDiplome(e.target.value)}
                />

                <select
                    className="w-[60%] text-center rounded-[50px] p-[5px]"
                    value={choixGroupe}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChoixGroupe(e.target.value)}
                >

                    <option key="default" value="">
                        Choisir un groupe
                    </option>
                    {groupes.map((groupe) => (
                        <option key={groupe.code_groupe} value={groupe.code_groupe}>
                            {groupe.nom_groupe}
                        </option>
                    ))}
                </select>

                <button type="submit" className="boutton_info_supp_utilisateur cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]">
                    <div className="pl-4">Valider l'inscription</div>
                    <div className="text-4xs p-[5px] pl-4 pr-4"><FaUserPlus /></div>
                </button>
                
            </form>

            <Validation
                isOpen={showConfirmationDialog}
                onConfirm={confirmerAjoutInfoParticipant}
                onCancel={annulerAjoutInfoParticipant}
                message="Êtes-vous sûr de continuer ?"
                bg_modal_show="bg-white shadow-sm"
                style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
                style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-300 hover:text-white"
            />

        </div>
    );
};

export default InfoSuppParticipant;