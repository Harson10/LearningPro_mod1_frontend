import React, { ChangeEvent, useEffect, useState } from "react";
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
  const [code_formation, setCodeFormation] = useState<number>();
  const [code_participant, setCodeParticipant] = useState<number>();


  const [popupStyle, setPopupStyle] = useState<string>("hide");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);


  useEffect(() => {
    const affichage = async () => {
      try {
        const reponse = await axios.get<Paiement>(`http://localhost:4000/paiement/${num_facture}`);
        setPaiements(reponse.data);
        console.log("reponse.data.transaction_formation: ", reponse.data.transaction_formation.code_formation);
        setDatePaiement(String(reponse.data.date_paiement));
        setTranchePaiement(reponse.data.tranche_paiement);
        setMontant(reponse.data.montant);
        setReste(reponse.data.reste);
        setCodeFormation(reponse.data.transaction_formation.code_formation);
        setCodeParticipant(reponse.data.transaction_participant.code_participant);

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
      const reqUpdatePaiement = await axios.put(`http://localhost:4000/paiement/modifier/${num_facture}`, infoPaiements);
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
    <div className="form_inscription">

      <div className="retour_tabBord" onClick={() => window.history.back()} >
        <button className="flex p-[13px]">
          <div className="pl-12">Retour</div>
          <div className="p-[3px] pl-4"><FaArrowLeft /></div>
        </button>
      </div>

      <div className={popupStyle}>
        <h3>L'enregistrement de paiemnet est un echec!!</h3>
        <p>Erreur lors de la création</p>
      </div>

      <form className="formulaireInscription overflow-hidden" onSubmit={handleSoumissionForm}>
        <h1 className="titre_inscription">Paiement</h1>

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

        <div className="w-[80%] h-auto p-[8px] flex flex-center b_inscription">
          <button type="submit" className="flex items-center">
            <div className="pl-4">Enregistrer</div>
            <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
          </button>
        </div>
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