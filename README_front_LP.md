# Guide d'Utilisation du Projet - Front-End

## Récupération du Projet

1. Clonez le projet depuis GitHub :
    ```bash
    git clone https://github.com/Etablissement-Ralaivao/LearningPro_mod1_frontend.git
    cd votre-projet-frontend
    ```

## Installation des Dépendances

2. Installez les dépendances avec Yarn :
    ```bash
    yarn install
    ```

## Démarrage du Serveur Front-End

3. Une fois les paquets installés, lancez le serveur en tapant dans votre terminal :
    ```bash
    yarn start
    ```

   Assurez-vous d'avoir préalablement lancé le serveur du backend.

4. Votre navigateur devrait s'ouvrir automatiquement. Sinon, ouvrez-le et accédez à l'URL :
    ```
    http://localhost:3000
    ```

5. Vous accédez ensuite à la page d'accueil.


## Connexion à l'Application

6. Cliquez sur "Se Connecter", entrez vos informations de connexion, puis validez.


## Gestion des Groupes

7. Cliquez sur l'onglet "Gérer les Groupes" pour créer des groupes en vue de l'inscription des participants.


## Création d'Utilisateurs (Administrateur)

8. En tant qu'administrateur, créez des utilisateurs dans l'onglet "Gérer les Utilisateurs".

9. Un administrateur peut créer les 3 niveaux d'utilisateur (Administrateur, Formateur, Participant).


## Création d'Utilisateurs (Formateur)

10. Un formateur peut créer uniquement des participants.

11. Lors de l'inscription d'un participant par un administrateur ou un formateur, un formulaire supplémentaire apparaîtra pour ajouter tous ses informations.


## Test avec un Utilisateur Différent

12. Pour tester un autre utilisateur, commencez par vous déconnecter et connectez-vous sur un compte formateur.

13. Créez une formation avant de créer les modules.

14. Enregistrez ensuite les "paiements" dans l'onglet correspondant pour pouvoir manipuler les contenus dans l'onglet "Publication".

15. Les participants n'auront accès qu'aux formations où ils sont inscrits.


Ceci conclut le guide d'utilisation du front-end. Pour toute question, veuillez contacter l'équipe de développement.
