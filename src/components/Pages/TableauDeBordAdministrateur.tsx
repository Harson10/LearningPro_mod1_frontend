import React, { useState } from "react";
import "../styles/TableauDeBordBase.css";
import Layout from "../utils/objetsTBord/Administrateur/LayoutAdministrateur";
// import ChartTableauDeBord from "../utils/objetsTBord/Administrateur/ChartTableauDeBord";
import Effectif from "../utils/objetsTBord/Effectifs";
import ListesUtilisateurs from "../utils/crudUtilisateurs/ListesUtilisateurs";
import { useAuth } from "../../context/AuthContext";
import { FaSignOutAlt, FaUserShield } from "react-icons/fa";
import ListeGroupe from "../utils/crudGroupe/ListeGroupe";
import Validation from "../Validation";

const TableauDeBordAdministrateur: React.FC = () => {
  const [navToggler, setNavToggler] = useState(false);
  const { deconnexion } = useAuth();
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false);

  const active = navToggler ? " active" : "";
  const handleActive = () => setNavToggler(!navToggler);

  const handleDeconnexion = async () => {
    setShowConfirmationDialog(true);
  }

  const confirmerDeconnexion = async () => {
    setShowConfirmationDialog(false);
    localStorage.removeItem("token");
    deconnexion();
    window.location.href = "/connexion";
  }

  const annulerDeconnexion = async () => {
    setShowConfirmationDialog(false)
  }

  return (
    <div className="tableau-de-bord-base">
      <div className="top-bloc">

        <button
          type="button"
          aria-label="toggle curtain navigation"
          className={"nav-toggler" + active}
          onClick={handleActive}
        >
          <span className="line l1"></span>
          <span className="line l2"></span>
          <span className="line l3"></span>
        </button>

        <div className="title h-auto">
          <div><strong><h1>LEARNING PRO</h1></strong></div>
          <div className="pr-6">
            Administrateur
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <div className="absolute translate-y-[-25px] pl-[60px]">
                <FaUserShield />
              </div>
            </div>
          </div>
        </div>

        <div className="bouton_deconnexion hover:scale-110" onClick={handleDeconnexion}>
          <div className="pl-4">Se déconnecter</div>
          <div className="pl-4 pr-4"><FaSignOutAlt /></div>
        </div>
      </div>

      <div className="body-bloc">

        <div className="sections">
          <section id="section1" className="section1 pt-[120px] h-screen w-screen">
            <div>
              <div className="flex item-center">
                <div className="w-[100px] h-[100px] m-[20px] bg-white rounded-[50%]"> </div>
                <img src="/utils/admin.jpg" className=" w-[22%] h-auto rounded-[50%]" alt="admin" />
                <div className="w-[100px] h-[100px] m-[20px] bg-white rounded-[50%]"> </div>
              </div>
              
            <h2 className="text-2xl font-bold mb-0 mt-4">Effectif des utilisateurs</h2>
              <Effectif />
              {/* <ChartTableauDeBord /> */}
            </div>
          </section>
          <section id="section2" className="section2 pt-[100px] w-screen h-screen">
            <div className="p-[10px] overflow-hidden flex">
              <ListesUtilisateurs />
            </div>
          </section>
          <section id="section3" className="section3 pt-[100px] w-screen h-screen">
            <div className="p-[10px] overflow-hidden">
              <ListeGroupe />
            </div>
          </section>
        </div>

        <div className={"sidebar" + active + " w-[250px]"}>
          <Layout />
        </div>

        <div className="fixed z-20">
          <Validation
            isOpen={showConfirmationDialog}
            onConfirm={confirmerDeconnexion}
            onCancel={annulerDeconnexion}
            message="Se déconnecter de Learning Pro ?"
            bg_modal_show="bg-white shadow-sm"
            style_pers_confirm="border border-gray-300 rounded-[8px] hover:bg-red-500 hover:text-white"
            style_pers_cancel="border border-gray-300 rounded-[8px] hover:bg-gray-400 hover:text-white"
          />
        </div>

      </div>
    </div>
  );
};

export default TableauDeBordAdministrateur;
