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

## Creation de la variable pour contenir l'adresse IP du PC serveur

3. Créez le fichier ".env" à la racine du projet au meme niveau que le "package.json" et modifiez son contenu avec :
    ```bash
    REACT_APP_ADR_IP_PC_SERVEUR=192.168.*.* 
    ```

## Démarrage du Serveur Front-End

4. Une fois les paquets installés, lancez le serveur en tapant dans votre terminal :
    ```bash
    yarn start
    ```

   Assurez-vous d'avoir préalablement lancé le serveur du backend.

5. Votre navigateur devrait s'ouvrir automatiquement. Sinon, ouvrez-le et accédez à l'URL :
    ```
    http://{REACT_APP_ADR_IP_PC_SERVEUR}:3000
    ```

6. Vous accédez ensuite à la page d'accueil.


## Connexion à l'Application

7. Cliquez sur "Se Connecter", entrez vos informations de connexion, puis validez.


## Gestion des Groupes

8. Cliquez sur l'onglet "Gérer les Groupes" pour créer des groupes en vue de l'inscription des participants.


## Création d'Utilisateurs (Administrateur)

9. En tant qu'administrateur, créez des utilisateurs dans l'onglet "Gérer les Utilisateurs".

10. Un administrateur peut créer les 3 niveaux d'utilisateur (Administrateur, Formateur, Participant).


## Création d'Utilisateurs (Formateur)

11. Un formateur peut créer uniquement des participants.

12. Lors de l'inscription d'un participant par un administrateur ou un formateur, un formulaire supplémentaire apparaîtra pour ajouter tous ses informations.


## Test avec un Utilisateur Différent

13. Pour tester un autre utilisateur, commencez par vous déconnecter et connectez-vous sur un compte formateur.

14. Créez une formation avant de créer les modules.

15. Enregistrez ensuite les "paiements" dans l'onglet correspondant pour pouvoir manipuler les contenus dans l'onglet "Publication".

16. Les participants n'auront accès qu'aux formations où ils sont inscrits.


Ceci conclut le guide d'utilisation du front-end. Pour toute question, veuillez contacter le développeur concerné.
