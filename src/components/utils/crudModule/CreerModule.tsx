import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import "../../styles/Form_Modif_Groupe.css";
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
        axios.get<Formation[]>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/formation/`)
        // axios.get<Formation[]>('http://localhost:4000/formation/')
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

            const response = await axios.post(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/module/creer`, nouveauModule);
            // const response = await axios.post('http://localhost:4000/module/creer', nouveauModule);
            console.log('Module créé avec succès', response.data);


            const cout_actuelle_formation = await axios.get(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/module/somme_cout_par_formation/${code_formation}`);
            // const cout_actuelle_formation = await axios.get(`http://localhost:4000/module/somme_cout_par_formation/${code_formation}`);
            console.log('Coup actuel', cout_actuelle_formation.data);

            const cout_formation_ = await cout_actuelle_formation.data;

            const infoF = await axios.get(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/formation/${code_formation}`)
            // const infoF = await axios.get(`http://localhost:4000/formation/${code_formation}`)
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

                axios.put(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/formation/modifier/${code_formation}`, newInfoFormation);
                // axios.put(`http://localhost:4000/formation/modifier/${code_formation}`, newInfoFormation);

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
        <div className="form_inscription relative w-screen h-screen box-border m-0 pb-8 text-center justify-center bg-cover bg-fixed bg-no-repeat bg-center font-sans overflow-y-scroll">

            <div className="relative w-full h-[10%]" onClick={() => window.history.back()} >
                <div className="flex relative w-full z-20">
                    <button className="retour_acceuil absolute px-0 w-[180px] top-[9px] left-[10px] h-[35px] lg:px-8 lg:w-[250px] lg:top-[12.25px] lg:left-[30px] lg:h-[50px] rounded-[30px] text-white font-bold shadow-md shadow-gray-700 border-2 border-white flex items-center hover:bg-green-700">
                        <div className="pl-4">Retour à l'acceuil</div>
                        <div className="p-[4px] pl-3"><FaArrowLeft /></div>
                    </button>
                </div>
            </div>

            <div className={popupStyle}>
                <h3>L'inscription est un echec!!</h3>
                <p>Erreur lors de la création</p>
            </div>

            <form className="formulaireInscription  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[60%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleCreerModule}>
                <h2 className="titre_inscription text-center">Création de module</h2>
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

                <button type="submit" className="boutton_modification_utilisateur cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]">
                    <div className="pl-4">Créer</div>
                    <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
                </button>

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