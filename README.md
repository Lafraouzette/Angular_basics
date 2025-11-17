# Angular

## Objectifs du Projet
- Comprandre l'architecture
-  le flux de comminication entre les differants composantes
- Ajouter des packages via npm (utilisation de `package.json`)
- Créer et utiliser des composants de base
- Configurer et gérer les routes
- Créer des services et des modèles et les intégrer avec la component customer

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
! tu doit les inclurs dans comp.ts pour les utiliser 

## creer un service et un model 
- Injectable : Décorateur utilisé en Angular pour indiquer qu'un service peut être injecté dans d'autres composants ou services via le système d'injection de dépendances.
- Observable : Objet qui permet de gérer des flux de données asynchrones (ex : requêtes HTTP, événements utilisateur). Il émet des valeurs au fil du temps et peut être souscrit via .subscribe().
- OnInit : Interface implémentée dans un composant Angular pour exécuter du code après son initialisation. Elle impose la méthode ngOnInit(), souvent utilisée pour initialiser des données.
- CommonModule, NgFor, NgIf : 
-- CommonModule : Module Angular qui fournit des directives et fonctionnalités communes (comme NgIf et NgFor).
-- NgFor : Directive permettant d'afficher une liste en itérant sur un tableau (*ngFor="let item of items").
-- NgIf : Directive conditionnelle permettant d'afficher ou masquer un élément en fonction d'une condition (*ngIf="condition").
  
## Exécution de l'Application
Pour lancer le projet avec un port spécifique :
```sh
ng serve --port 2001
```

## Différence entre Module et Composant
- **Modules** : Gèrent l'organisation et la structure de l'application, regroupant et configurant différentes parties.
- **Composants** : Responsables de l'affichage de l'interface utilisateur, chaque composant étant une unité indépendante avec sa propre logique et vue.

## Architecture MVVM dans Angular

### Qu'est-ce que MVVM ?
MVVM (Model-View-ViewModel) est un pattern architectural qui sépare l'application en trois couches :
- **Model** : Les données et la logique métier
- **View** : L'interface utilisateur (template HTML)
- **ViewModel** : La couche intermédiaire qui expose les données et méthodes à la View

### ⚠️ Important : Dans Angular, le ViewModel EST le Component !

Dans Angular, **pas besoin de fichier `.vm.ts` séparé**. Le fichier `.component.ts` joue déjà le rôle de ViewModel.

### Structure MVVM dans Angular

```
feature/
  ├── models/
  │     └── model.ts           ← MODEL (structure des données)
  │
  ├── services/
  │     └── service.ts         ← Accès au MODEL (API, logique métier)
  │
  └── components/
        └── component-name/
              ├── component.ts    ← VIEWMODEL (état et logique de présentation)
              ├── component.html  ← VIEW (interface utilisateur)
              └── component.css   ← VIEW (styles)
```

### Exemple Concret : Feature Customer

Voici comment le pattern MVVM est implémenté dans le projet avec le composant `customer` :

#### 1️⃣ **MODEL** - `customer.model.ts`
Définit la structure des données :
```typescript
export interface Customer {
  id: number;
  name: string;
  email: string;
}
```

#### 2️⃣ **SERVICE** - `customer.service.ts`
Gère l'accès aux données (API, logique métier) :
```typescript
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private customers: Customer[] = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];

  getCustomers(): Observable<Customer[]> {
    return of(this.customers);
  }
}
```

#### 3️⃣ **VIEWMODEL** - `customer.component.ts`
Le composant TypeScript = ViewModel. Il contient :
- L'**état** de la vue (propriétés)
- La **logique** de présentation (méthodes)
- La **communication** avec le Model (via le service)

```typescript
@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, NgFor, NgIf],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  // ÉTAT de la vue (ViewModel)
  customers$!: Observable<Customer[]>;

  // Injection du service pour communiquer avec le Model
  constructor(private customerService: CustomerService) {}

  // Initialisation de l'état
  ngOnInit(): void {
    this.customers$ = this.customerService.getCustomers();
  }
}
```

#### 4️⃣ **VIEW** - `customer.component.html`
L'interface utilisateur qui affiche les données :
```html
<h2>Liste des utilisateurs</h2>

<ul *ngIf="customers$ | async as customers">
  <li *ngFor="let customer of customers;">
    <strong>{{ customer.name }}</strong> - {{ customer.email }}
  </li>
</ul>
```

### Flux de Communication MVVM

```
┌─────────────────────────────────────────────────┐
│  VIEW (customer.component.html)                │
│  - Affiche les données                          │
│  - Utilise: {{ customer.name }}                │
│  - Utilise: *ngFor, *ngIf                       │
└─────────────────────────────────────────────────┘
         ↑
         │ Data Binding (liaison automatique)
         │
┌─────────────────────────────────────────────────┐
│  VIEWMODEL (customer.component.ts)              │
│  - État: customers$                             │
│  - Logique: ngOnInit()                          │
│  - Appelle le Service                           │
└─────────────────────────────────────────────────┘
         ↑
         │ Appel de méthode
         │
┌─────────────────────────────────────────────────┐
│  SERVICE (customer.service.ts)                  │
│  - getCustomers(): Observable<Customer[]>      │
│  - Gère l'accès aux données                     │
└─────────────────────────────────────────────────┘
         ↑
         │ Retourne les données
         │
┌─────────────────────────────────────────────────┐
│  MODEL (customer.model.ts)                      │
│  - Interface Customer                           │
│  - Structure des données                        │
└─────────────────────────────────────────────────┘
```

### Points Clés à Retenir

1. ✅ **Le Component TypeScript = ViewModel** : Pas besoin de fichier `.vm.ts` séparé
2. ✅ **Le Template HTML = View** : Affiche les données via le data binding
3. ✅ **Le Service = Accès au Model** : Gère les appels API et la logique métier
4. ✅ **Le Model = Structure des données** : Interface/Type qui définit les données
5. ✅ **Change Detection automatique** : Angular met à jour la vue quand l'état change

### Structure Recommandée pour un Nouveau Feature

Pour créer un nouveau feature (ex: `produits`), suivez cette structure :

```
features/
  └── produits/
        ├── models/
        │     └── produit.model.ts        ← 1️⃣ MODEL
        │
        ├── services/
        │     └── produit.service.ts      ← 2️⃣ SERVICE (API)
        │
        └── components/
              └── produit-list/
                    ├── produit-list.component.ts    ← 3️⃣ VIEWMODEL
                    ├── produit-list.component.html  ← VIEW
                    └── produit-list.component.css   ← VIEW (style)
```

**C'est tout ! 3 fichiers principaux suffisent : Model, Service, Component (ViewModel + View).**

## Résolution de Problèmes
En cas de problème avec npm:
- supprimer package-lock.json, node_modules , .angular
- exécutez les commandes :
```sh
npm install 
```

```sh
npm install glob@latest rimraf@latest inflight@latest
```

🚀🚀🚀🚀🚀

