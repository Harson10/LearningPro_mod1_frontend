import React from "react";
import { Link } from "react-router-dom";
import "../styles/Acceuil.css";
import AnimBienvenu from "../AnimBienvenu";
import { FaSignInAlt } from "react-icons/fa";

const Acceuil: React.FC = () => {
  return (
    <div>
      
      <div className="enTete flex relative w-full h-[50px] lg:h-[75px] z-20 shadow-md shadow-gray-700">
        <div className="absolute w-auto h-auto p-2 pt-2 lg:pt-3 left-[3%] font-bold text-[25px] lg:text-[35px] text-white">
          <h1>LEARNING PRO</h1>
        </div>
        <Link to="/connexion">
          <button className="bouton_connexion_acceuil absolute px-0 w-[160px] top-[9px] right-[10px] h-[35px] lg:px-8 lg:w-[250px] lg:top-[12.25px] lg:right-[30px] lg:h-[50px] rounded-[30px] text-white font-bold shadow-md border-2 border-white flex items-center hover:bg-green-700">
            <div className="pl-4">Se connecter</div>
            <div className="p-[4px] pl-3"><FaSignInAlt /></div>
          </button>
        </Link>
      </div>

      <div className="absolute top-0 bg-opacity-60 bg-gray-500 w-full h-full z-0">
        <div className="bienvenu absolute top-[12%] left-[5%] lg:top-[35%] lg:left-[10%]">
          <span>
            Bienvenue sur <br /> <div className='anim-bienvenu'><AnimBienvenu /></div>
          </span>
        </div>
        <div className="illustration flex absolute top-[25%] right-0 w-[100%] lg:top-[20%] lg:right-[7%] lg:w-[40%]">
          <img src="/utils/dessin.svg" className="dessin_acceuil" alt="acceuil" />
        </div>
        <img
          src="/utils/logo_ets_ralaivao.png"
          className="logo_ets"
          alt="Logo de l'établissement RALAIVAO"
        />
        <div className="nom_ets_ralaivao absolute top-[72%] left-[15%] w-[335px] p-3 pr-4 text-[12.5px] lg:top-[74%] lg:left-[18%] lg:w-[480px] lg:p-4 lg:pr-4 lg:text-auto text-white text-right lg:text-center justify-center items-center border border-white rounded-br-[30px] shadow-md">
          <span>Etablissement RALAIVAO</span>
        </div>
      </div>
    </div>
  );
};

export default Acceuil;
