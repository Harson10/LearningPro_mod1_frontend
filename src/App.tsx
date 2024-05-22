import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import TableauDeBordAdministrateur from "./components/Pages/TableauDeBordAdministrateur";
import Acceuil from "./components/Pages/Acceuil";
import FormulaireConnexion from "./components/Pages/FormulaireConnexion";
import { useEffect, useState } from "react";
import axios from "axios";
import FormulaireInscription from "./components/utils/crudUtilisateurs/FormulaireInscription";
import ModifierUtilisateur from "./components/utils/crudUtilisateurs/FormulaireModification";
import InfoSuppParticipant from "./components/utils/crudParticipants/InfoSuppParticipant";
import ModifierGroupe from "./components/utils/crudGroupe/ModifierGroupe";
import FormulaireGroupe from "./components/utils/crudGroupe/FormulaireGroupe";
import TableauDeBordFormateur from "./components/Pages/TableauDeBordFormateur";
import FormulaireInscriptionParticipant from "./components/utils/crudParticipants/FormulaireInscriptionParticipant";
import ModifierParticipant from "./components/utils/crudParticipants/FormulaireModificationParticipant";
import Participant from "./components/Pages/PageParticipant";
import CreerModule from "./components/utils/crudModule/CreerModule";
import ModifierModule from "./components/utils/crudModule/ModifierModule";
import ModifierFormation from "./components/utils/crudFormation/ModifierFormation";
import CreerFormation from "./components/utils/crudFormation/CreerFormation";
import FormulairePaiement from "./components/utils/crudPaiement/FormulairePaiement";
import FormulaireModifPaiement from "./components/utils/crudPaiement/FormulaireModifPaiement";
import AjoutEtapeContenu from "./components/utils/crudEtape/AjoutEtapeContenu";
import ModifierEtapeContenu from "./components/utils/crudEtape/ModifierEtapeContenu";
// import ListeEtapeContenuParticipant from "./components/utils/crudEtape/ListeEtapeContenuParticipant";
import PageParticipantB from "./components/Pages/PageParticipantB";

function App() {
  const [estAuthentifiee, setEstAuthentifiee] = useState(false);
  const [roleAPIFromChild, setRoleAPIFromChild] = useState<string | null>(null);
  const token = localStorage.getItem("token");
  // const codeUtilisateur = localStorage.getItem("codeUtilisateur")

  console.log("Role du composant fils:", roleAPIFromChild);
  // console.log("Code utilisateur:", codeUtilisateur);

  useEffect(() => {
    if (token) {
      setEstAuthentifiee(true);
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem("token", token);
    }

    const storedRole = localStorage.getItem("roleUtilisateur");
    if (storedRole) {
      setRoleAPIFromChild(storedRole);
    }

    console.log("IP: ", process.env.REACT_APP_ADR_IP_PC_SERVEUR);


  }, [token]);

  const redirectionElement = estAuthentifiee ? (
    roleAPIFromChild === "Administrateur" ? (
      <Navigate to="/tableau-de-bord/administrateur" />
    ) : roleAPIFromChild === "Formateur" ? (
      <Navigate to="/tableau-de-bord/formateur" />
    ) : roleAPIFromChild === "Participant" ? (
      <Navigate to="/page/participant" />
    ) : (
      <Navigate to="/"/>
    )
  ) : (
    <Acceuil />
  );

  return (
    <div className="page">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={!estAuthentifiee ? <Acceuil /> : redirectionElement} />
          <Route
            path="/connexion"
            element={
              !estAuthentifiee ? (
                <FormulaireConnexion
                  onRoleAPI={(role) => {
                    setRoleAPIFromChild(role);
                    setEstAuthentifiee(true);
                  }}
                />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/tableau-de-bord/administrateur"
            element={
              estAuthentifiee ? (<TableauDeBordAdministrateur />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/tableau-de-bord/formateur"
            element={
              estAuthentifiee ? (<TableauDeBordFormateur />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/page/participant"
            element={
              estAuthentifiee ? (<Participant />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/inscription-utilisateur"
            element={
              estAuthentifiee ? (<FormulaireInscription />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/creer-module"
            element={
              estAuthentifiee ? (<CreerModule />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/creer-etape"
            element={
              estAuthentifiee ? (<AjoutEtapeContenu />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/creer-formation"
            element={
              estAuthentifiee ? (<CreerFormation />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/nouveau-paiement"
            element={
              estAuthentifiee ? (<FormulairePaiement />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/inscription-utilisateur/role/participant"
            element={
              estAuthentifiee ? (<FormulaireInscriptionParticipant />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/inscription-utilisateur/participant-info"
            element={
              estAuthentifiee ? (<InfoSuppParticipant />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/utilisateur/modifier/:code_utilisateur"
            element={
              estAuthentifiee ? (<ModifierUtilisateur />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/module/liste-contenu-participant/:code_module"
            element={
              estAuthentifiee ? (<PageParticipantB />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/module/modifier/:code_module"
            element={
              estAuthentifiee ? (<ModifierModule />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/etape/modifier/:num_etape"
            element={
              estAuthentifiee ? (<ModifierEtapeContenu />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/formation/modifier/:code_formation"
            element={
              estAuthentifiee ? (<ModifierFormation />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/paiement/modifier/:num_facture"
            element={
              estAuthentifiee ? (<FormulaireModifPaiement />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/participant/modifier/:code_utilisateur/:code_participant"
            element={
              estAuthentifiee ? (<ModifierParticipant />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/groupe"
            element={
              estAuthentifiee ? (<FormulaireGroupe />) : (<Navigate to="/connexion" />)
            }
          />
          <Route
            path="/groupe/modifier/:code_groupe"
            element={
              estAuthentifiee ? (<ModifierGroupe />) : (<Navigate to="/connexion" />)
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
