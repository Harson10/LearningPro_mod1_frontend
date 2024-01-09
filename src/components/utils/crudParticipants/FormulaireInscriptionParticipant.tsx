import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaUserPlus } from "react-icons/fa";
import Validation from "../../Validation";


interface Role {
  code_role: string;
  role: string;
}


const FormulaireInscriptionParticipant: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [sexe, setSexe] = useState('');
  const [profession, setProfession] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [confirmemotdepasse, setConfirmeMotDePasse] = useState('');
  const [choixRole, setChoixRole] = useState('');
  const [popupStyle, setPopupStyle] = useState<string>("hide");
  const navigate = useNavigate();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const choixSexe = [
    { key: 1, value: "Masculin" },
    { key: 2, value: "Féminin" }
  ];

  useEffect(() => {
    axios.get<Role[]>('http://localhost:4000/role/')
      .then(response => {
        if (response.data && Array.isArray(response.data)) {
          setRoles(response.data);
          setChoixRole(response.data[0]?.code_role || '');
        } else {
          console.error('Données non disponibles');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données');
      });
  }, []);


  const handleInscription = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mot_de_passe !== confirmemotdepasse) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    setShowConfirmationDialog(true);
  };


  const confirmerInscription = async () => {
    
    setShowConfirmationDialog(false);


    const nouvelUtilisateur = {
      nom: nom,
      prenom: prenom,
      adresse: adresse,
      sexe: sexe,
      profession: profession,
      mot_de_passe: mot_de_passe,
      code_role: choixRole
    };

    try {
      console.log(choixRole);

      const toNumberRole = Number.parseInt(choixRole);

      const reponseRole = await axios.get(`http://localhost:4000/role/${toNumberRole}`)
      console.log(reponseRole.data.role);

      // Condition pour la redirection en fonction du choix de rôle
      if (reponseRole.data.role === "Participant") {
        const response = await axios.post('http://localhost:4000/utilisateur/creer', nouvelUtilisateur);
        console.log('Utilisateur bien créé avec succès', response.data);
        navigate('/inscription-utilisateur/participant-info');
      } else {
        alert("Vous pouvez inscrire uniquement des participants !!!");
        window.history.back()
      }
    } catch (error) {
      setPopupStyle("popup_connexion");
      setTimeout(() => setPopupStyle("hide"), 3000);
      const err = error
      console.error('Erreur lors de la création', err);
    }
  }

  const annulerInscription = async () => {
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
        <h3>L'inscription est un echec!!</h3>
        <p>Erreur lors de la création</p>
      </div>

      <form className="formulaireInscription overflow-hidden" onSubmit={handleInscription}>
        <h1 className="titre_inscription">Inscription</h1>
        <input
          type="text"
          placeholder='Saissisez un nom*'
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          type="text"
          placeholder='Saissisez un prénom*'
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <input
          type="text"
          placeholder='Saissisez une adresse*'
          value={adresse}
          onChange={(e) => setAdresse(e.target.value)}
        />
        <input
          type="text"
          placeholder='Saissisez une profession*'
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
        />
        <input
          type="password"
          placeholder='Saissisez un mot de passe*'
          value={mot_de_passe}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
        <input
          type="password"
          placeholder='Confirmez le mot de passe*'
          value={confirmemotdepasse}
          onChange={(e) => setConfirmeMotDePasse(e.target.value)}
        />
        <select
          className="w-[60%] text-center rounded-[50px] p-[5px]"
          value={sexe}
          onChange={(e) => setSexe(e.target.value)}
        >
          <option key="default" value="">
            Choisir le sexe
          </option>
          {
            choixSexe.map((sexeChoisi) => (
              <option key={sexeChoisi.key} value={sexeChoisi.value} className="bg-green-300 text-black-300">
                {sexeChoisi.value}
              </option>
            )
            )}
        </select>

        <select
          className="w-[60%] text-center rounded-[50px] p-[5px]"
          value={choixRole}
          onChange={(e) => setChoixRole(e.target.value)}
        >
          <option key="default" value="">
            Choisir un role
          </option>
          {
            roles.map((role) => (
              <option key={role.code_role} value={role.code_role} className="bg-green-300 text-black-300">
                {role.role}
              </option>
            )
            )}
        </select>

        <div className="w-[80%] h-auto p-[8px] flex flex-center b_inscription">
          <button type="submit" className="flex items-center">
            <div className="pl-4">Inscrire l'utilisateur</div>
            <div className="text-4xs p-[5px] pl-4 pr-4"><FaUserPlus /></div>
          </button>
        </div>
      </form>

      <Validation
        isOpen={showConfirmationDialog}
        onConfirm={confirmerInscription}
        onCancel={annulerInscription}
        message="Confirmer l'inscription ?"
        bg_modal_show="bg-white shadow-sm"
        style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-sky-500 hover:text-white"
        style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
      />

    </div>
  );
};

export default FormulaireInscriptionParticipant;
