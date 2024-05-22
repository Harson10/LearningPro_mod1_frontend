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
    axios.get<Formation[]>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/formation/`)
    // axios.get<Formation[]>('http://localhost:4000/formation/')
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
    axios.get<Participant[]>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/participant/`)
    // axios.get<Participant[]>('http://localhost:4000/participant/')
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

    axios.get<Participant>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/participant/${code_participant}`)
    // axios.get<Participant>(`http://localhost:4000/participant/${code_participant}`)
      .then(response => {
        const code_utilisateur = response.data.code_utilisateur;
        setChoixUtilisateur(String(code_utilisateur));

        axios.get<Utilisateur>(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/utilisateur/${code_utilisateur}`)
        // axios.get<Utilisateur>(`http://localhost:4000/utilisateur/${code_utilisateur}`)
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
      const reqPaiement = await axios.post(`http://${process.env.REACT_APP_ADR_IP_PC_SERVEUR}:4000/paiement/creer/`, nouveauPaiement);
      // const reqPaiement = await axios.post("http://localhost:4000/paiement/creer/", nouveauPaiement);
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

      <form className="formulaireInscription  absolute top-[12.5%] left-1/2 transform -translate-x-1/2 flex flex-col w-[90%] lg:w-1/3  h-[100%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900" onSubmit={handlePaiement}>
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

        <button type="submit" className="boutton_modification_utilisateur cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]">
          <div className="pl-4">Enregistrer</div>
          <div className="text-4xs p-[5px] pl-4 pr-4"><FaPlus /></div>
        </button>

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