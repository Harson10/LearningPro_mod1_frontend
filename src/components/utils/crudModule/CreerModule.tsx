import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Validation from "../../Validation";


interface Formation {
    code_formation: number;
    nom_formation: string;
    coup_formation: number;
    publication: string;
}

const CreerModule: React.FC = () => {

    const [formations, setFormations] = useState<Formation[]>([]);
    const [choixFormation, setChoixFormation] = useState<string>("");
    const [nom_module, setNomModule] = useState("");
    const [cout_module, setCoutModule] = useState<number>();
    const [popupStyle, setPopupStyle] = useState<string>("hide");
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);
    const [infoFormation, setInfoFormation] = useState({
        nom_formation: "",
        cout_formation: 0,
        publication: "Non",
    });

    useEffect(() => {
        // Récupérer les formations
        axios.get<Formation[]>('http://localhost:4000/formation/')
            .then(response => {
                if (response.data && Array.isArray(response.data)) {
                    setFormations(response.data);
                    setChoixFormation(String(response.data[0]?.code_formation || ""));
                } else {
                    console.error('Données sur les formations non disponibles');
                }
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données sur les formations');
            });
    }, []);



    const handleCreerModule = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setShowConfirmationDialog(true);
    };

    const confirmerCreationModule = async () => {

        setShowConfirmationDialog(false);

        const nouveauModule = {
            nom_module: nom_module,
            cout_module: cout_module,
            code_formation: choixFormation
        };

        try {
            const code_formation = nouveauModule.code_formation;
            console.log('Code de formation: ', code_formation)

            const response = await axios.post('http://localhost:4000/module/creer', nouveauModule);
            console.log('Module créé avec succès', response.data);


            const cout_actuelle_formation = await axios.get(`http://localhost:4000/module/somme_cout_par_formation/${code_formation}`);
            console.log('Coup actuel', cout_actuelle_formation.data);

            const cout_formation_ = await cout_actuelle_formation.data;

            const infoF = await axios.get(`http://localhost:4000/formation/${code_formation}`)
                .catch(error => {
                    console.error('Erreur lors de la récupération des informations sur la formation :', error);
                    throw error;
                });

            const formation = infoF.data;
            console.log("infoF: ", formation);

            setInfoFormation(prevInfoFormation => {
                const newInfoFormation = {
                    ...prevInfoFormation,
                    nom_formation: formation.nom_formation,
                    cout_formation: cout_formation_.sum,
                    publication: formation.publication,
                };
                console.log('Total cout_formation:', cout_formation_, '\nNouveau_infoFormation: ', newInfoFormation, '\nAncien_infoFormation: ', infoFormation);

                setInfoFormation(newInfoFormation);

                axios.put(`http://localhost:4000/formation/modifier/${code_formation}`, newInfoFormation);

                return newInfoFormation;
            });


        } catch (error) {
            setPopupStyle("popup_connexion");
            setTimeout(() => setPopupStyle("hide"), 3000);
            console.log('Erreur lors de la création du module', error);
        }
        window.history.back()
    }

    const annulerCreationModule = async () => {
        setShowConfirmationDialog(false);
    }



    return (
        <div className="form_inscription">

            <div className="retour_tabBord" onClick={() => window.history.back()} >
                <button className="flex p-[13px]">
                    <div className="pl-12">Retour</div>
                    <div className="p-[3px] pl-4"><FaArrowLeft /></div>
                </button>
            </div>


            <div className={popupStyle}>
                <h3>La création est un echec!!</h3>
                <p>Erreur lors de la création</p>
            </div>

            <form className="formulaireInscription w-[35%] h-[50%] overflow-hidden" onSubmit={handleCreerModule}>
                <h2 className="titre_inscription">Création de module</h2>
                <input
                    type="text"
                    placeholder='Nom du module*'
                    value={nom_module}
                    onChange={(e) => setNomModule(e.target.value)}
                />
                <input
                    type="text"
                    placeholder='Cout du module*'
                    value={cout_module}
                    onChange={(e) => setCoutModule(parseInt(e.target.value))}
                />

                <select
                    className="w-[60%] text-center rounded-[50px] p-[5px]"
                    value={choixFormation}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChoixFormation(e.target.value)}
                >

                    <option key="default" value="">
                        Choisir une formation
                    </option>
                    {formations.map((formation) => (
                        <option key={formation.code_formation} value={formation.code_formation}>
                            {formation.nom_formation}
                        </option>
                    ))}
                </select>

                <div className="w-[80%] h-auto p-[8px] flex flex-center b_inscription">
                    <button type="submit" className="flex items-center">
                        <div className="pl-4">Créer</div>
                        <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
                    </button>
                </div>
            </form>

            <Validation
                isOpen={showConfirmationDialog}
                onConfirm={confirmerCreationModule}
                onCancel={annulerCreationModule}
                message="Confirmer la création du module ?"
                bg_modal_show="bg-white shadow-sm"
                style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
                style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
            />

        </div>
    );
}

export default CreerModule;