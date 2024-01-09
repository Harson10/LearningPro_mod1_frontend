import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Validation from "../../Validation";

const CreerFormation: React.FC = () => {
    const [nom_formation, setNomFormation] = useState("");
    const [cout_formation, setCoutFormation] = useState<number>();
    const [pub, setPub] = useState<boolean>(false);
    const [publication, setPublication] = useState("Non");
    const [popupStyle, setPopupStyle] = useState<string>("hide");
    const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

    useEffect(() => {
        setCoutFormation(0);
        if (pub) {
            setPublication("Oui");
        }
        else setPublication("Non");
    }, [pub])

    const handleCreerFormation = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        setShowConfirmationDialog(true);
    };

    const confirmerCreationFormation = async () => {
        setShowConfirmationDialog(false);

        const nouvelleFormation = {
            nom_formation: nom_formation,
            cout_formation: cout_formation,
            publication: publication
        };

        try {
            const response = await axios.post('http://localhost:4000/formation/creer', nouvelleFormation);
            console.log('Formation créée avec succès', response.data);
        } catch (error) {
            setPopupStyle("popup_connexion");
            setTimeout(() => setPopupStyle("hide"), 3000);
            console.log('Erreur lors de la création de la formation', error);
        }

        window.history.back();
    };

    const annulerCreationFormation = () => {
        setShowConfirmationDialog(false);
    };

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


            <form className="formulaireInscription w-[35%] h-[50%] overflow-hidden" onSubmit={handleCreerFormation}>
                <h2 className="titre_inscription">Création de formation</h2>
                <input
                    type="text"
                    placeholder='Nom de la formation*'
                    value={nom_formation}
                    onChange={(e) => setNomFormation(e.target.value)}
                />
                <label className="w-[80%] h-[40px] p-[8px] bg-white text-gray-400 rounded-[30px]">
                    <div className="w-[100%]">
                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center">
                                Publique:
                                <div className="ml-4 w-[20px] h-[20px] mt-[-5px]">
                                    <input
                                        className="m-0 p-0"
                                        type="checkbox"
                                        checked={pub}
                                        onChange={(e) => setPub(e.target.checked)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </label>
                <div className="w-[80%] h-auto p-[8px] flex flex-center b_inscription">
                    <button type="submit" className="flex items-center">
                        <div className="pl-4">Créer</div>
                        <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
                    </button>
                </div>
            </form>

            <Validation
                isOpen={showConfirmationDialog}
                onConfirm={confirmerCreationFormation}
                onCancel={annulerCreationFormation}
                message="Confirmer la création de la formation ?"
                bg_modal_show="bg-white shadow-sm"
                style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
                style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
            />
        </div>
    );
}

export default CreerFormation;


/* <input
    type="text"
    placeholder='Cout de la formation*'
    value={cout_formation}
    onChange={(e) => setCoutFormation(Number.parseInt(e.target.value))}
/> */