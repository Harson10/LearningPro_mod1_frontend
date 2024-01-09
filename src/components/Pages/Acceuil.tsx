import React from "react";
import { Link } from "react-router-dom";
import "../styles/Acceuil.css";
import AnimBienvenu from "../AnimBienvenu";
import { FaSignInAlt } from "react-icons/fa";

const Acceuil: React.FC = () => {
  return (
    <div>
      <div className="enTete">
        <div className="nom_plateforme">
          <h1>LEARNING PRO</h1>
        </div>
        <Link to="/connexion">
          <button className="bouton_connexion_acceuil flex w-[220px] p-[9px]">
            <div className="pl-4">Se connecter</div>
            <div className="p-[4px] pl-4"><FaSignInAlt /></div>
          </button>
        </Link>
      </div>

      <div className="corps_acceuil">
        <div className="bienvenu">
          <span>
            Bienvenue sur <br /> <div className='anim-bienvenu'><AnimBienvenu /></div>
          </span>
        </div>
        <div className="illustration">
          <img src="/utils/dessin.svg" className="dessin_acceuil" alt="acceuil" />
        </div>
        <img
          src="/utils/logo_ets_ralaivao.png"
          className="logo_ets"
          alt="Logo de l'établissement RALAIVAO"
        />
        <div className="nom_ets_ralaivao">
          <span>Etablissement RALAIVAO</span>
        </div>
      </div>
    </div>
  );
};

export default Acceuil;
