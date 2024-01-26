import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import DatePicker from "react-datepicker";
import Validation from "../../Validation";


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


const FormulairePaiement: React.FC = () => {
  const [transaction_formation, setFormations] = useState<Formation[]>([]);
  const [transaction_participant, setParticipant] = useState<Participant[]>([]);
  const [transaction_utilisateur, setUtilisateur] = useState<Utilisateur>();
  const [choixFormation, setChoixFormation] = useState<string>("");
  const [choixParticipant, setChoixParticipant] = useState<string>("");
  const [choixUtilisateur, setChoixUtilisateur] = useState<string>("");

  const [date_paiement, setDatePaiement] = useState("");
  const [tranche_paiement, setTranchePaiement] = useState<number>();
  const [montant, setMontant] = useState<number>();
  const [reste, setReste] = useState<number>();

  const [popupStyle, setPopupStyle] = useState<string>("hide");
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  
  useEffect(() => {
    axios.get<Formation[]>('http://localhost:4000/formation/')
      .then(reponse => {
        if (reponse.data && Array.isArray(reponse.data)) {
          setFormations(reponse.data);
          setChoixFormation(String(reponse.data[0]?.code_formation || ''));
        } else {
          console.error('Données non disponibles');
        }
      })
      .catch(error => {
        console.log('Erreur lors de la récupération des données');
      });
    axios.get<Participant[]>('http://localhost:4000/participant/')
      .then(reponse => {
        if (reponse.data && Array.isArray(reponse.data)) {
          setParticipant(reponse.data);
          setChoixParticipant(String(reponse.data.map(p => p.code_participant) || ''));
        } else {
          console.error('Données non disponibles');
        }
      })
      .catch(error => {
        console.log('Erreur lors de la récupération des données', error);
      })
  }, []);

  const handleChangeU = (e: ChangeEvent<HTMLSelectElement>) => {
    setChoixParticipant(e.target.value);
    const code_participant = parseInt(e.target.value);

    axios.get<Participant>(`http://localhost:4000/participant/${code_participant}`)
      .then(response => {
        const code_utilisateur = response.data.code_utilisateur;
        setChoixUtilisateur(String(code_utilisateur));

        axios.get<Utilisateur>(`http://localhost:4000/utilisateur/${code_utilisateur}`)
          .then((response) => {
            setUtilisateur(response.data);
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des données utilisateur', error);
          });
      })
  }

  const handlePaiement = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowConfirmationDialog(true);
  };

  const confirmerEnregistrementPaiement = async () => {
    setShowConfirmationDialog(false);
    const nouveauPaiement = {
      date_paiement: date_paiement,
      tranche_paiement: tranche_paiement,
      montant: montant,
      reste: reste,
      code_formation: choixFormation,
      code_participant: choixParticipant,
      code_utilisateur: choixUtilisateur
    }
    try {
      const reqPaiement = await axios.post("http://localhost:4000/paiement/creer/", nouveauPaiement);
      console.log('Paiement enregistré avec succes', reqPaiement.data);
      window.history.back();
    } catch (error) {
      setPopupStyle("popup_connexion");
      setTimeout(() => setPopupStyle("hide"), 3000);
      console.error("Erreur lors de l'enregistrement:", error);
    }
  }

  const annulerEnregistrementPaiement = async () => {
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

      <form className="formulaireInscription overflow-hidden" onSubmit={handlePaiement}>
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

        <select
          className="w-[60%] text-center rounded-[50px] p-[5px]"
          value={choixFormation}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setChoixFormation(e.target.value)}
        >
          <option key="default" value="">
            Choisir une formation
          </option>
          {transaction_formation.map((formation) => (
            <option key={formation.code_formation} value={formation.code_formation}>
              {formation.nom_formation}
            </option>
          ))}
        </select>

        <select
          className="w-[60%] text-center rounded-[50px] p-[5px]"
          value={choixParticipant}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
            setChoixParticipant(e.target.value);
            handleChangeU(e);
          }}
        >
          <option key="default" value="">
            Choisir un participant
          </option>
          {transaction_participant.map((participant) => (
            <option key={participant.code_participant} value={participant.code_participant}>
              {participant.code_participant}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder='Nom'
          value={transaction_utilisateur?.nom}
          readOnly
        />

        <input
          type="text"
          placeholder='Prénom'
          value={transaction_utilisateur?.prenom}
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
        onConfirm={confirmerEnregistrementPaiement}
        onCancel={annulerEnregistrementPaiement}
        message="Confirmer l'enregistrement ?"
        bg_modal_show="bg-white shadow-sm"
        style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
        style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
      />

    </div>
  );
};
export default FormulairePaiement;