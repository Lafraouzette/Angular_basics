# Apprentissage des Principes d'Angular

## Objectifs du Projet
- Comprendre les bases d'Angular et son fonctionnement
- Ajouter des packages via npm (utilisation de `package.json`)
- Créer et utiliser des composants de base
- Configurer et gérer les routes
- Créer des services et des modèles et les intégrer avec les composants
- Implémenter un CRUD avec des données statiques

## Concepts de Base
### Théorie
- Le premier fichier chargé lors du démarrage de l'application est `main.ts`
- Le composant principal de l'application est `app.component`
- Angular supporte le concept de Single Page Application (SPA), où `index.html` sert de point d'entrée contenant le composant principal `<app-root>`

## Installation de Packages
Pour ajouter des packages, par exemple Bootstrap :
```sh
npm install bootstrap --save
```
Ensuite, ajoutez les liens CSS et JS dans `angular.json` sous la section `styles` et `scripts`.

## Création et Utilisation de Composants
Utilisez la commande suivante pour générer un composant :
```sh
ng generate component NomComposant
```
- `app.component.html` est le point d'entrée de l'application, où l'UI doit être modifiée.
- `app.component.ts` est le fichier où les composants sont importés pour être reconnus par la vue.
- Les composants fréquemment utilisés peuvent être placés dans un dossier `shared`.

## Configuration des Routes
Les routes sont définies dans le fichier `app.routes.ts`.
- `RouterOutlet` est l'emplacement où les composants seront affichés selon les routes.
- `RouterLink` remplace `href` et est utilisé pour la navigation entre les pages Angular.

## Exécution de l'Application
Pour lancer le projet avec un port spécifique :
```sh
ng serve --port 2001
```

## Différence entre Module et Composant
- **Modules** : Gèrent l'organisation et la structure de l'application, regroupant et configurant différentes parties.
- **Composants** : Responsables de l'affichage de l'interface utilisateur, chaque composant étant une unité indépendante avec sa propre logique et vue.

## Résolution de Problèmes
En cas de problème avec npm, exécutez la commande suivante :
```sh
npm install glob@latest rimraf@latest inflight@latest
```

Bon apprentissage d'Angular ! 🚀

