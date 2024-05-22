import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Validation from "../../Validation";
import { useParams } from "react-router";


interface Formation {
  code_formation: number;
  cout_formation: number;
  nom_formation: string;
  publication: string
}
interface Participant {
  code_participant: number;
  code_utilisateur: number
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


const FormulaireModifPaiement: React.FC = () => {

  const { num_facture } = useParams();
  const [paiements, setPaiements] = useState<Paiement>();

  const [date_paiement, setDatePaiement] = useState("");
  const [tranche_paiement, setTranchePaiement] = useState<number>();
  const [montant, setMontant] = useState<number>();
  const [reste, setReste] = useState<number>();


  const [popupStyle, setPopupStyle] = useState<string>("hide");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);


  useEffect(() => {
    const affichage = async () => {
      try {
        const reponse = await axios.get<Paiement>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/paiement/${num_facture}`);
        // const reponse = await axios.get<Paiement>(`http://localhost:4000/paiement/${num_facture}`);
        setPaiements(reponse.data);
        console.log("reponse.data.transaction_formation: ", reponse.data.transaction_formation.code_formation);
        setDatePaiement(String(reponse.data.date_paiement));
        setTranchePaiement(reponse.data.tranche_paiement);
        setMontant(reponse.data.montant);
        setReste(reponse.data.reste);

        console.log("Paiement:", reponse.data)
      } catch (error) {
        console.error("Erreur lors de la récupération d'information :", error);
      }
    };
    affichage();
  }, [num_facture]);

  const handleSoumissionForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmationDialog(true);
  };

  const confirmerSoumissionForm = async () => {
    setShowConfirmationDialog(false);

    const infoPaiements = {
      num_facture: paiements?.num_facture,
      date_paiement: date_paiement,
      tranche_paiement: tranche_paiement,
      montant: montant,
      reste: reste,
      code_formation: paiements?.transaction_formation.code_formation,//transaction_formation,
      code_participant: paiements?.transaction_participant.code_participant,//transaction_participant,
    };

    try {
      const reqUpdatePaiement = await axios.put(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/paiement/modifier/${num_facture}`, infoPaiements);
      // const reqUpdatePaiement = await axios.put(`http://localhost:4000/paiement/modifier/${num_facture}`, infoPaiements);
      console.log('Paiement à jour : ', reqUpdatePaiement.data);
      window.history.back();
    } catch (error) {
      setPopupStyle("popup_connexion");
      setTimeout(() => setPopupStyle("hide"), 3000);
      console.error("Erreur lors de l'enregistrement:", error);
    }
  }


  const annulerSoumissionForm = async () => {
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

      <form className="formulaireInscription  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[100%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handleSoumissionForm}>
        <h1 className="titre_inscription text-center">Paiement</h1>

        <div className="z-20">
          <DatePicker
            selected={date_paiement ? new Date(date_paiement) : null}
            onChange={(date: Date) => setDatePaiement(date.toISOString().split('T')[0])}
            placeholderText="Date de paiement"
            dateFormat="dd-MM-yyyy"
            className=" border p-2"
            calendarClassName="border border-sky-300 p-2"
          />
        </div>

        <input
          type="text"
          placeholder='Tranche de paiement*'
          value={tranche_paiement}
          onChange={(e) => setTranchePaiement(parseInt(e.target.value))}
        />

        <input
          type="text"
          placeholder='Montant*'
          value={montant}
          onChange={(e) => setMontant(parseInt(e.target.value))}
        />

        <input
          type="text"
          placeholder='Reste*'
          value={reste}
          onChange={(e) => setReste(parseInt(e.target.value))}
        />

        <input
          type="text"
          placeholder='Formation'
          value={paiements?.transaction_formation.nom_formation}
          readOnly
        />

        <input
          type="text"
          placeholder='code_participant'
          value={paiements?.transaction_participant.code_participant}
          readOnly
        />

        <input
          type="text"
          placeholder='Nom'
          value={paiements?.transaction_utilisateur.nom}
          readOnly
        />

        <input
          type="text"
          placeholder='Prénom'
          value={paiements?.transaction_utilisateur.prenom}
          readOnly
        />

        <button type="submit" className="boutton_modification_utilisateur cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]">
          <div className="pl-4">Enregistrer</div>
          <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
        </button>

      </form>


      <Validation
        isOpen={showConfirmationDialog}
        onConfirm={confirmerSoumissionForm}
        onCancel={annulerSoumissionForm}
        message="Êtes-vous sûr des modifications ?"
        bg_modal_show="bg-white shadow-sm"
        style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
        style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
      />


    </div>
  );
}

export default FormulaireModifPaiement;