
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
      const { token, roleUtilisateur, codeUtilisateur } = reponse.data;

      const reponseRole = await axios.get(`http://localhost:4000/role/${roleUtilisateur}`);
      const roleAPI = reponseRole.data.role;

      localStorage.setItem("token", token);
      localStorage.setItem("roleUtilisateur", roleAPI);
      localStorage.setItem("codeUtilisateur", codeUtilisateur);
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
      setPopupStyle(""+
        "popup_connexion shadow-sm shadow-gray-700");
      setTimeout(() => setPopupStyle("hide"), 3000);
    }
  };

  return (
    <div className="form_connexion flex relative w-screen h-screen box-border m-0 text-center justify-center items-center bg-cover bg-fixed bg-no-repeat bg-center font-sans">

      <div className="absolute w-full h-full bg-transparent">
        <div className="flex relative w-full h-[50px] lg:h-[75px] z-20">
          <Link to="/">
            <button className="retour_acceuil absolute px-0 w-[180px] top-[9px] left-[10px] h-[35px] lg:px-8 lg:w-[250px] lg:top-[12.25px] lg:left-[30px] lg:h-[50px] rounded-[30px] text-white font-bold shadow-md shadow-gray-700 border-2 border-white flex items-center hover:bg-green-700">
              <div className="pl-4">Retour à l'acceuil</div>
              <div className="p-[4px] pl-3"><FaArrowLeft /></div>
            </button>
          </Link>
        </div>
      </div>

      <div className={popupStyle}>
        <h3>La connexion a échoué!!</h3>
        <p>Le nom d'utilisateur ou le mot de passe est incorrect</p>
      </div>

      <form className="formulaireConnexion absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col w-[90%] lg:w-1/3  h-[60%]  pt-[8%] lg:pt-2 text-center items-center justify-around rounded-[30px] shadow-md shadow-gray-900">
        <h1 className="titre_connexion text-center">Connexion</h1>
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
        <div 
          className="boutton_connexion cursor-pointer justify-center w-4/5 h-auto p-2 m-0 mx-2 text-base flex items-center transition duration-300 border border-white rounded-[30px] font-sans text-white z-20 mb-[5%]" 
          onClick={handleConnexion}
        >
          <div className="pl-4">Se connecter</div>
          <div className="pl-4 pr-4"><FaSignInAlt /></div>
        </div>
      </form>

    </div>
  );
};

export default FormulaireConnexion;
