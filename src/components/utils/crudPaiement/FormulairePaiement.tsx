import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../styles/FormulaireInscription.css";
import { useNavigate } from "react-router";
import { FaArrowLeft, FaMoneyCheck } from "react-icons/fa";
import Validation from "../../Validation";

interface Paiement {
  num_facture: number;
  date_paiement: Date;
//   tranche_paiement: number;
  montant: number;
  reste: number;
  code_formation: number;
  code_participant: number;
  formation: {
    // Define Formation properties here if needed
  };
  participant: {
    // Define Participant properties here if needed
  };
}
const FormulairePaiement: React.FC = () => {
    const [paiements, setPaiements] = useState<Paiement[]>([]);

    useEffect(() => {
      axios.get<Paiement[]>('http://localhost:4000/paiement/')
        .then(response => {
          if (response.data && Array.isArray(response.data)) {
            setPaiements(response.data);
          } else {
            console.error('Données non disponibles');
          }
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des données');
        });
    }, []);
  
    return (
      <div className="paiement_container">
        <h1>Liste des Paiements</h1>
        <table>
          <thead>
            <tr>
              <th>Numéro Facture</th>
              {/* <th>Date Paiement</th> */}
              {/* <th>Tranche Paiement</th> */}
              <th>Montant</th>
              <th>Reste</th>
              <th>Code Formation</th>
              <th>Code Participant</th>
            </tr>
          </thead>
          <tbody>
            {paiements.map(paiement => (
              <tr key={paiement.num_facture}>
                <td>{paiement.num_facture}</td>
                {/* <td>{paiement.date_paiement}</td> */}
                {/* <td>{paiement.tranche_paiement}</td> */}
                <td>{paiement.montant}</td>
                <td>{paiement.reste}</td>
                <td>{paiement.code_formation}</td>
                <td>{paiement.code_participant}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Add any additional UI elements or components as needed */}
      </div>
    );
  };
export default FormulairePaiement;