// FormulaireConnexion.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/FormulaireConnexion.css";
import { useAuth } from "../../context/AuthContext";
import { FaArrowLeft, FaSignInAlt } from "react-icons/fa";

interface FormulaireConnexionProps {
  onRoleAPI: (role: string) => void;
}

const FormulaireConnexion: React.FC<FormulaireConnexionProps> = ({ onRoleAPI }) => {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [mot_de_passe, setMotDePasse] = useState("");
  const [popupStyle, setPopupStyle] = useState<string>("hide");

  const { connexion } = useAuth();

  const handleConnexion = async () => {
    try {
      const reponse = await axios.post("http://localhost:4000/utilisateur/connexion", {
        nom,
        prenom,
        mot_de_passe,
      });
      const { token, roleUtilisateur } = reponse.data;

      const reponseRole = await axios.get(`http://localhost:4000/role/${roleUtilisateur}`);
      const roleAPI = reponseRole.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("roleUtilisateur", roleAPI);
      connexion();

      // Utilisez la fonction passée en tant que prop pour remonter le rôle
      onRoleAPI(roleAPI);

      switch (roleAPI) {
        case "Administrateur":
          window.location.href = "/tableau-de-bord/administrateur";
          break;
        case "Formateur":
          window.location.href = "/tableau-de-bord/formateur";
          break;
      }
    } catch (error) {
      setPopupStyle("popup_connexion");
      setTimeout(() => setPopupStyle("hide"), 3000);
    }
  };

  return (
    <div className="form_connexion">

      <div className="retour_acceuil w-[220px]">
        <Link to="/">
          <button className="flex p-[13px]">
            <div className="pl-4">Retour à l'acceuil</div>
            <div className="p-[3px] pl-4"><FaArrowLeft /></div>
          </button>
        </Link>
      </div>

      <div className={popupStyle}>
        <h3>La connexion a échoué!!</h3>
        <p>Le nom d'utilisateur ou le mot de passe est incorrect</p>
      </div>

      <form className="formulaireConnexion">
        <h1 className="titre_connexion">Connexion</h1>
        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
        <input
          type="text"
          placeholder="Prénom(s)"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={mot_de_passe}
          onChange={(e) => setMotDePasse(e.target.value)}
        />
        <div className="boutton_connexion" onClick={handleConnexion}>
          <div className="pl-4">Se connecter</div>
          <div className="pl-4 pr-4"><FaSignInAlt /></div>
        </div>
      </form>

    </div>
  );
};

export default FormulaireConnexion;
