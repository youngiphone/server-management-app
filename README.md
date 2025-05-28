Server Management App
Une application web pour gérer des serveurs Ubuntu via SSH, vérifier leur statut de mise à jour et effectuer des mises à jour. Inclut une interface moderne avec thème sombre/clair.
Structure du projet
server-management-app/
├── client/                # Frontend React
├── server/                # Backend Node.js
├── .gitignore
├── README.md
└── LICENSE

Prérequis

Node.js (>= 16.x)
npm (>= 8.x)
Serveurs Ubuntu accessibles via SSH avec authentification par mot de passe

Installation

Cloner le dépôt :
git clone https://github.com/yourusername/server-management-app.git
cd server-management-app


Installer le frontend :
cd client
npm install


Installer le backend :
cd ../server
npm install


Configurer les variables d'environnement :

Copiez server/.env.example vers server/.env et configurez PORT si nécessaire.


Lancer le backend :
cd server
npm start


Lancer le frontend :
cd client
npm start



Utilisation

Accédez à l'interface sur http://localhost:5173.
Ajoutez des serveurs en entrant leur nom, IP, utilisateur et mot de passe.
Vérifiez le statut des mises à jour et mettez à jour les serveurs individuellement ou tous à la fois.
Basculez entre thème sombre et clair avec le bouton en haut à droite.

Sécurité

Ne stockez pas les mots de passe en clair. Utilisez des variables d'environnement.
Configurez HTTPS pour les communications en production.
Envisagez l'utilisation de clés SSH pour une sécurité accrue.

Déploiement

Frontend : Déployez sur Vercel, Netlify ou GitHub Pages.
Backend : Déployez sur un VPS (AWS, DigitalOcean) avec Nginx et HTTPS.

Licence
MIT
