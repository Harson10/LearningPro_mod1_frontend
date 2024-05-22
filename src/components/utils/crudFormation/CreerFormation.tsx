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
                <h3>La création est un echec!!</h3>
                <p>Erreur lors de la création</p>
            </div>


            <form className="formulaireInscription  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[50%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleCreerFormation}>
                <h1 className="titre_inscription-- text-center">Création de formation</h1>
                <input
                    type="text"
                    placeholder='Nom de la formation*'
                    value={nom_formation}
                    onChange={(e) => setNomFormation(e.target.value)}
                />
                <label className="w-[80%] h-[40px] p-[8px] bg-white text-gray-400 rounded-[30px]">
                    <div className="w-[100%]">
                        <div className="absolute left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center text-black">
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

                <button type="submit" className="boutton_modification_utilisateur cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]">
                    <div className="pl-4">Créer</div>
                    <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
                </button>

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