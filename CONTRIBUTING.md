# Guide de Contribution

Merci de votre intérêt pour contribuer au projet **Spam Detector** ! Ce guide vous fournira toutes les informations nécessaires pour participer de manière efficace.

---

## Comment contribuer ?

1. **Signaler un bug :**
   - Vérifiez d'abord si le problème n'a pas déjà été signalé dans les issues du dépôt GitHub.
   - Si ce n'est pas le cas, créez une nouvelle issue en décrivant le problème de manière claire :
     - Ce que vous attendiez comme comportement.
     - Ce que vous avez rencontré comme comportement.
     - Les étapes pour reproduire le problème.

2. **Proposer une nouvelle fonctionnalité :**
   - Soumettez une issue en décrivant la fonctionnalité souhaitée, son utilité et son impact potentiel sur le projet.

3. **Améliorer le code :**
   - Réparez des bugs.
   - Améliorez les performances.
   - Refactorisez du code pour le rendre plus lisible ou maintenable.

4. **Améliorer la documentation :**
   - Complétez ou corrigez le README.md, le CONTRIBUTING.md ou d'autres parties de la documentation.

---

## Étapes pour contribuer

### 1. Forker le dépôt

Depuis la page GitHub du projet, cliquez sur le bouton "Fork" pour créer une copie du dépôt dans votre espace.

### 2. Cloner votre fork

Clonez votre fork localement avec la commande suivante :
```bash
git clone <url-de-votre-fork>
cd spam-detector-project-AOS
```

### 3. Créer une branche pour vos modifications

Créez une branche dédiée à vos modifications pour éviter d'impacter la branche `main` :
```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
```

### 4. Installer les dépendances et configurer le projet

Installez les dépendances nécessaires :
```bash
cd auth-services
npm install
cd ../spam-detector-backend
npm install
cd ../spam-detector-frontend
npm install
```

Configurez les fichiers `.env` dans les répertoires `auth-services` et `spam-detector-backend` comme indiqué dans le [README.md](README.md).

### 5. Apporter vos modifications

Faites vos modifications en respectant les conventions de codage du projet.

### 6. Tester vos changements

Assurez-vous que vos modifications fonctionnent comme prévu en testant localement :
```bash
docker-compose up
```

### 7. Committer et pousser vos modifications

Commitez vos changements avec un message clair et explicite :
```bash
git add .
git commit -m "Ajout d'une nouvelle fonctionnalité pour l'analyse des emails"
git push origin feature/ma-nouvelle-fonctionnalite
```

### 8. Créer une Pull Request

Depuis votre dépôt forké sur GitHub, cliquez sur le bouton **New Pull Request** pour proposer vos modifications au dépôt principal.

---

## Meilleures pratiques

- **Code lisible et documenté :**
  - Suivez les conventions de codage du projet.
  - Documentez votre code si nécessaire.

- **Tests :**
  - Ajoutez des tests unitaires ou fonctionnels pour valider vos changements.

- **Collaboration :**
  - Engagez-vous avec les mainteneurs et autres contributeurs en répondant aux commentaires.

---

## Licence

En contribuant au projet, vous acceptez que vos contributions soient publiées sous la licence MIT.

---

Merci de votre collaboration et bienvenue dans la communauté **Spam Detector** !