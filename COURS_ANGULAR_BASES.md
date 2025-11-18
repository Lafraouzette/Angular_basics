# 📘 Cours : Les Fondations d'Angular

**Objectif** : Comprendre les concepts essentiels pour être autonome dans un projet Angular.

---

## 📋 Table des Matières

1. [Project Structure (Angular CLI)](#1-project-structure-angular-cli)
2. [Components (Composants)](#2-components-composants)
3. [Templates & Data Binding](#3-templates--data-binding)
4. [Directives](#4-directives)
5. [Pipes](#5-pipes)
6. [Services & Dependency Injection](#6-services--dependency-injection)
7. [Résumé Visuel](#-résumé-visuel)
8. [Exercice Pratique](#-exercice-pratique)

---

## 1️⃣ Project Structure (Angular CLI)

### Qu'est-ce qu'Angular CLI ?

**Angular CLI** (Command Line Interface) est un outil en ligne de commande qui permet de :
- ✅ Créer des projets Angular
- ✅ Générer des composants, services, modules automatiquement
- ✅ Compiler et lancer l'application
- ✅ Tester et builder l'application

### Installation

```bash
npm install -g @angular/cli
```

**Vérifier l'installation** :
```bash
ng version
```

### Création d'un Projet

```bash
ng new my-app
cd my-app
ng serve -o
```

**Options utiles** :
- `--routing` : Ajoute le module de routing
- `--style=css|scss|less` : Choisir le préprocesseur CSS
- `--skip-git` : Ne pas initialiser Git

### Structure d'un Projet Angular

```
my-app/
├── src/                          # Code source principal
│   ├── app/                      # Application Angular
│   │   ├── app.component.ts      # Composant racine
│   │   ├── app.component.html    # Template du composant
│   │   ├── app.component.css     # Styles du composant
│   │   ├── app.config.ts         # Configuration de l'app
│   │   └── app.routes.ts         # Routes de l'application
│   ├── assets/                   # Fichiers statiques (images, etc.)
│   ├── environments/             # Configurations par environnement
│   │   ├── environment.ts       # Dev
│   │   └── environment.prod.ts  # Production
│   ├── index.html               # Point d'entrée HTML
│   └── main.ts                  # Point d'entrée TypeScript
├── angular.json                  # Configuration Angular CLI
├── package.json                  # Dépendances npm
├── tsconfig.json                 # Configuration TypeScript
└── README.md                     # Documentation
```

### Fichiers Importants

| Fichier/Dossier | Rôle |
|----------------|------|
| `src/app/` | Contient tout le code de l'application |
| `app.component.*` | Composant racine (premier affiché) |
| `app.config.ts` | Configuration globale (providers, etc.) |
| `app.routes.ts` | Définition des routes |
| `assets/` | Images, polices, fichiers statiques |
| `environments/` | Variables selon l'environnement |
| `angular.json` | Configuration du projet Angular |
| `package.json` | Liste des dépendances npm |

### Commandes CLI Essentielles

```bash
# Générer un composant
ng generate component users
ng g c users

# Générer un service
ng generate service user
ng g s user

# Générer un module
ng generate module products
ng g m products

# Lancer l'application
ng serve
ng serve --port 4200

# Builder pour production
ng build
ng build --configuration production

# Lancer les tests
ng test
```

---

## 2️⃣ Components (Composants)

### Qu'est-ce qu'un Composant ?

Un **composant** est une **brique UI réutilisable** de l'application. C'est comme un Lego : tu assembles plusieurs composants pour créer une application complète.

**Un composant = HTML + CSS + TypeScript + Métadonnées**

### Structure d'un Composant

```
users/
  ├── users.component.ts      # Logique et données (ViewModel)
  ├── users.component.html    # Template (View)
  ├── users.component.css     # Styles
  └── users.component.spec.ts # Tests unitaires
```

### Création d'un Composant

```bash
ng generate component users
# ou version courte
ng g c users
```

**Options utiles** :
```bash
ng g c users --skip-tests        # Sans fichier de test
ng g c users --inline-style      # Styles dans le .ts
ng g c users --inline-template   # Template dans le .ts
ng g c users --standalone        # Composant standalone (Angular 14+)
```

### Exemple Simple

**users.component.ts**
```typescript
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent {
  title = "Liste des utilisateurs";
  users = ['Alice', 'Bob', 'Charlie'];
}
```

**users.component.html**
```html
<h2>{{ title }}</h2>
<ul>
  <li *ngFor="let user of users">{{ user }}</li>
</ul>
```

**users.component.css**
```css
h2 {
  color: blue;
}
```

### Utilisation dans un Autre Composant

**app.component.html**
```html
<app-users></app-users>
```

### Cycle de Vie d'un Composant

Angular fournit des hooks (méthodes) appelés à différents moments :

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';

export class UsersComponent implements OnInit, OnDestroy {
  ngOnInit() {
    // Appelé après l'initialisation
    console.log('Composant initialisé');
  }

  ngOnDestroy() {
    // Appelé avant la destruction
    console.log('Composant détruit');
  }
}
```

**Hooks principaux** :
- `ngOnInit()` : Après l'initialisation
- `ngOnDestroy()` : Avant la destruction
- `ngOnChanges()` : Quand les inputs changent
- `ngAfterViewInit()` : Après l'initialisation de la vue

---

## 3️⃣ Templates & Data Binding

### Qu'est-ce que le Data Binding ?

Le **data binding** est la **communication automatique** entre la vue (HTML) et la logique (TypeScript). C'est le cœur d'Angular !

### Les 4 Types de Data Binding

| Type | Syntaxe | Direction | Usage |
|------|---------|-----------|-------|
| **Interpolation** | `{{ variable }}` | Component → View | Afficher des valeurs |
| **Property Binding** | `[property]="value"` | Component → View | Passer des valeurs aux propriétés HTML |
| **Event Binding** | `(event)="method()"` | View → Component | Écouter les événements |
| **Two-Way Binding** | `[(ngModel)]="value"` | Component ↔ View | Synchroniser les formulaires |

### 1. Interpolation `{{ }}`

Affiche une valeur du composant dans le template.

**Exemple** :
```typescript
// users.component.ts
export class UsersComponent {
  username = 'Alice';
  age = 25;
  isActive = true;
}
```

```html
<!-- users.component.html -->
<p>Nom : {{ username }}</p>
<p>Âge : {{ age }}</p>
<p>Statut : {{ isActive ? 'Actif' : 'Inactif' }}</p>
```

**Résultat** :
```
Nom : Alice
Âge : 25
Statut : Actif
```

### 2. Property Binding `[property]`

Passe une valeur du composant à une propriété HTML.

**Exemple** :
```typescript
export class UsersComponent {
  imageUrl = 'https://example.com/image.jpg';
  isDisabled = false;
  buttonClass = 'btn-primary';
}
```

```html
<img [src]="imageUrl" alt="Photo">
<button [disabled]="isDisabled">Cliquer</button>
<div [class]="buttonClass">Contenu</div>
```

**Cas d'usage** :
- Désactiver/activer un bouton
- Changer l'URL d'une image
- Appliquer des classes CSS dynamiquement

### 3. Event Binding `(event)`

Écoute un événement et appelle une méthode du composant.

**Exemple** :
```typescript
export class UsersComponent {
  count = 0;

  increment() {
    this.count++;
  }

  onInputChange(event: any) {
    console.log('Valeur:', event.target.value);
  }
}
```

```html
<button (click)="increment()">Cliquer</button>
<input (input)="onInputChange($event)" placeholder="Taper...">
```

**Événements courants** :
- `(click)` - Clic de souris
- `(input)` - Saisie dans un input
- `(change)` - Changement de valeur
- `(submit)` - Soumission de formulaire
- `(keyup)` / `(keydown)` - Touches du clavier
- `(mouseenter)` / `(mouseleave)` - Souris entre/sort

### 4. Two-Way Binding `[(ngModel)]`

Synchronise automatiquement les données dans les deux sens.

**⚠️ Important** : Nécessite `FormsModule` ou `ReactiveFormsModule`.

**Exemple** :
```typescript
import { FormsModule } from '@angular/forms';

@Component({
  imports: [FormsModule], // ← Important !
  // ...
})
export class UsersComponent {
  username = '';
  email = '';
}
```

```html
<input [(ngModel)]="username" placeholder="Nom">
<p>Vous avez saisi : {{ username }}</p>

<input [(ngModel)]="email" type="email" placeholder="Email">
<p>Email : {{ email }}</p>
```

**Comment ça marche** :
1. Tu tapes dans l'input → `username` se met à jour automatiquement
2. Tu changes `username` dans le code → l'input se met à jour automatiquement

**Équivalent** :
```html
<!-- [(ngModel)]="username" est équivalent à : -->
<input [value]="username" (input)="username = $event.target.value">
```

---

## 4️⃣ Directives

### Qu'est-ce qu'une Directive ?

Une **directive** modifie l'apparence, le comportement ou la structure du DOM.

### Types de Directives

1. **Directives structurelles** : Modifient la structure du DOM (ajoutent/suppriment des éléments)
2. **Directives d'attributs** : Modifient l'apparence ou le comportement d'un élément existant

### Directives Structurelles

#### `*ngIf` - Afficher/Masquer

Affiche ou masque un élément selon une condition.

**Exemple** :
```typescript
export class UsersComponent {
  isLoggedIn = true;
  users = ['Alice', 'Bob'];
}
```

```html
<p *ngIf="isLoggedIn">Bienvenue !</p>
<p *ngIf="!isLoggedIn">Veuillez vous connecter</p>

<div *ngIf="users.length > 0">
  <p>Il y a {{ users.length }} utilisateurs</p>
</div>
```

**Avec else** :
```html
<div *ngIf="isLoggedIn; else loginTemplate">
  <p>Contenu pour utilisateur connecté</p>
</div>

<ng-template #loginTemplate>
  <p>Veuillez vous connecter</p>
</ng-template>
```

#### `*ngFor` - Répéter des Éléments

Répète un élément pour chaque item d'une liste.

**Exemple** :
```typescript
export class UsersComponent {
  users = [
    { id: 1, name: 'Alice', email: 'alice@example.com' },
    { id: 2, name: 'Bob', email: 'bob@example.com' },
    { id: 3, name: 'Charlie', email: 'charlie@example.com' }
  ];
}
```

```html
<ul>
  <li *ngFor="let user of users">
    {{ user.name }} - {{ user.email }}
  </li>
</ul>
```

**Avec index** :
```html
<ul>
  <li *ngFor="let user of users; let i = index">
    {{ i + 1 }}. {{ user.name }}
  </li>
</ul>
```

**Avec trackBy (pour optimiser les performances)** :
```typescript
trackByUserId(index: number, user: any): number {
  return user.id;
}
```

```html
<li *ngFor="let user of users; trackBy: trackByUserId">
  {{ user.name }}
</li>
```

### Directives d'Attributs

#### `[ngClass]` - Classes CSS Dynamiques

Ajoute ou supprime des classes CSS selon des conditions.

**Exemple** :
```typescript
export class UsersComponent {
  isActive = true;
  isError = false;
}
```

```html
<!-- Syntaxe objet -->
<p [ngClass]="{'active': isActive, 'error': isError}">
  Texte
</p>

<!-- Syntaxe tableau -->
<p [ngClass]="['btn', 'btn-primary']">
  Bouton
</p>

<!-- Syntaxe conditionnelle -->
<p [ngClass]="isActive ? 'active' : 'inactive'">
  Statut
</p>
```

#### `[ngStyle]` - Styles Dynamiques

Modifie les styles CSS directement.

**Exemple** :
```typescript
export class UsersComponent {
  color = 'blue';
  fontSize = '16px';
  isBold = true;
}
```

```html
<p [ngStyle]="{'color': color, 'font-size': fontSize}">
  Texte stylé
</p>

<p [ngStyle]="{'font-weight': isBold ? 'bold' : 'normal'}">
  Texte en gras ou normal
</p>
```

---

## 5️⃣ Pipes

### Qu'est-ce qu'un Pipe ?

Un **pipe** formate l'affichage des données **sans modifier les données réelles**. C'est comme un filtre pour l'affichage.

**Syntaxe** : `{{ valeur | pipe }}`

### Pipes Intégrés d'Angular

#### Pipes de Formatage de Texte

```html
{{ 'hello' | uppercase }}        <!-- HELLO -->
{{ 'WORLD' | lowercase }}       <!-- world -->
{{ 'hello world' | titlecase }} <!-- Hello World -->
```

#### Pipes de Formatage de Nombres

```html
{{ 1234.56 | number }}              <!-- 1,234.56 -->
{{ 1234.56 | number:'1.2-2' }}     <!-- 1,234.56 -->
{{ 0.5 | percent }}                 <!-- 50% -->
{{ 100 | currency }}                <!-- $100.00 -->
{{ 100 | currency:'EUR' }}         <!-- €100.00 -->
{{ 100 | currency:'EUR':'symbol':'1.2-2' }} <!-- €100.00 -->
```

#### Pipes de Formatage de Dates

```html
{{ today | date }}                  <!-- Jan 15, 2024 -->
{{ today | date:'short' }}         <!-- 1/15/24, 10:30 AM -->
{{ today | date:'medium' }}         <!-- Jan 15, 2024, 10:30:00 AM -->
{{ today | date:'long' }}          <!-- January 15, 2024 at 10:30:00 AM GMT+1 -->
{{ today | date:'full' }}          <!-- Monday, January 15, 2024 at 10:30:00 AM GMT+01:00 -->
{{ today | date:'dd/MM/yyyy' }}    <!-- 15/01/2024 -->
{{ today | date:'HH:mm' }}         <!-- 10:30 -->
```

#### Pipes Utilitaires

```html
<!-- JSON Pipe (pour le debug) -->
{{ user | json }}

<!-- Slice Pipe (tronquer un tableau) -->
{{ users | slice:0:3 }}            <!-- Premiers 3 éléments -->

<!-- Async Pipe (pour les Observables) -->
{{ data$ | async }}                 <!-- Souscrit automatiquement -->
```

### Chaînage de Pipes

Tu peux combiner plusieurs pipes :

```html
{{ username | uppercase | slice:0:5 }}
{{ price | currency:'EUR' | lowercase }}
```

### Pipe Personnalisé

Créer un pipe personnalisé :

```bash
ng generate pipe truncate
```

**truncate.pipe.ts** :
```typescript
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number = 20): string {
    if (value.length <= limit) {
      return value;
    }
    return value.substring(0, limit) + '...';
  }
}
```

**Utilisation** :
```html
{{ 'Texte très long à tronquer' | truncate:10 }}
<!-- Résultat : Texte trè... -->
```

---

## 6️⃣ Services & Dependency Injection

### Qu'est-ce qu'un Service ?

Un **service** contient la **logique métier** et la **communication avec les APIs**. Il permet de **partager des données et des fonctionnalités** entre plusieurs composants.

### Pourquoi Utiliser un Service ?

- ✅ **Réutilisabilité** : Une seule logique utilisée par plusieurs composants
- ✅ **Séparation des responsabilités** : La logique métier est séparée de la présentation
- ✅ **Testabilité** : Plus facile à tester unitairement
- ✅ **Maintenabilité** : Code centralisé, plus facile à maintenir

### Création d'un Service

```bash
ng generate service user
# ou version courte
ng g s user
```

### Exemple de Service Simple

**user.service.ts** :
```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root' // ← Service disponible dans toute l'application
})
export class UserService {
  private users = ['John', 'Sara', 'Lina'];

  getUsers(): string[] {
    return this.users;
  }

  addUser(user: string): void {
    this.users.push(user);
  }
}
```

### Injection dans un Composant

**users.component.ts** :
```typescript
import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-users',
  // ...
})
export class UsersComponent implements OnInit {
  users: string[] = [];

  // Injection via le constructeur
  constructor(private userService: UserService) {}

  ngOnInit() {
    this.users = this.userService.getUsers();
  }

  addUser(name: string) {
    this.userService.addUser(name);
    this.users = this.userService.getUsers(); // Rafraîchir la liste
  }
}
```

### Service avec HttpClient (API)

**user.service.ts** :
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/users';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  createUser(user: Omit<User, 'id'>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }
}
```

**users.component.ts** :
```typescript
import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';

@Component({
  selector: 'app-users',
  // ...
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  isLoading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
  }
}
```

### Dependency Injection (DI)

**Dependency Injection** = Angular fournit automatiquement les dépendances (services) aux composants.

**Comment ça marche** :
1. Tu déclares le service dans le constructeur
2. Angular crée une instance du service (singleton si `providedIn: 'root'`)
3. Le service est disponible dans le composant

**Exemple** :
```typescript
// Angular crée automatiquement une instance de UserService
constructor(private userService: UserService) {}
```

**Avantages** :
- ✅ Pas besoin de créer manuellement les instances
- ✅ Gestion automatique du cycle de vie
- ✅ Facilite les tests (on peut mocker les services)

---

## 🎯 Résumé Visuel

| Concept | Rôle | Exemple |
|---------|------|---------|
| **CLI** | Créer & gérer un projet | `ng new`, `ng g c` |
| **Component** | Bloc UI réutilisable | `users.component.ts` |
| **Template** | Vue HTML | `users.component.html` |
| **Data Binding** | Communication Vue ↔ TS | `{{ }}`, `[ ]`, `( )`, `[( )]` |
| **Directives** | Contrôle du DOM | `*ngIf`, `*ngFor`, `[ngClass]` |
| **Pipes** | Formatage de données | `{{ price \| currency }}` |
| **Services** | Logique métier + API | `user.service.ts` |
| **DI** | Injection automatique | `constructor(private service)` |

---

## 📌 Exercice Pratique

### Objectif

Créer une application de gestion de produits avec :
- Liste de produits
- Filtre de recherche
- Formatage avec pipes
- Utilisation de services

### Étapes

#### 1️⃣ Créer le Projet

```bash
ng new products-app
cd products-app
ng serve
```

#### 2️⃣ Créer le Modèle

**src/app/models/product.model.ts** :
```typescript
export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}
```

#### 3️⃣ Créer le Service

```bash
ng g s product
```

**src/app/services/product.service.ts** :
```typescript
import { Injectable } from '@angular/core';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products: Product[] = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics' },
    { id: 3, name: 'Table', price: 199.99, category: 'Furniture' },
    { id: 4, name: 'Chair', price: 99.99, category: 'Furniture' },
    { id: 5, name: 'Book', price: 19.99, category: 'Books' }
  ];

  getProducts(): Product[] {
    return this.products;
  }

  getProductsByCategory(category: string): Product[] {
    return this.products.filter(p => p.category === category);
  }
}
```

#### 4️⃣ Créer le Composant

```bash
ng g c product-list
```

**src/app/components/product-list/product-list.component.ts** :
```typescript
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchTerm = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.products = this.productService.getProducts();
    this.filteredProducts = this.products;
  }

  onSearch() {
    if (!this.searchTerm) {
      this.filteredProducts = this.products;
      return;
    }
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}
```

**src/app/components/product-list/product-list.component.html** :
```html
<div class="container">
  <h2>Liste des Produits</h2>

  <!-- Two-Way Binding pour la recherche -->
  <div class="search-box">
    <input 
      type="text" 
      [(ngModel)]="searchTerm" 
      (input)="onSearch()"
      placeholder="Rechercher un produit...">
  </div>

  <!-- Liste avec *ngFor -->
  <div *ngIf="filteredProducts.length > 0; else noResults" class="products-grid">
    <div *ngFor="let product of filteredProducts" class="product-card">
      <h3>{{ product.name | uppercase }}</h3>
      <p class="price">{{ product.price | currency:'EUR' }}</p>
      <p class="category">{{ product.category }}</p>
    </div>
  </div>

  <ng-template #noResults>
    <p>Aucun produit trouvé.</p>
  </ng-template>
</div>
```

**src/app/components/product-list/product-list.component.css** :
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.search-box {
  margin-bottom: 20px;
}

.search-box input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.product-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.product-card h3 {
  margin-top: 0;
  color: #333;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #2c3e50;
}

.category {
  color: #7f8c8d;
  font-size: 14px;
}
```

#### 5️⃣ Ajouter la Route

**src/app/app.routes.ts** :
```typescript
import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent }
];
```

#### 6️⃣ Configurer HttpClient

**src/app/app.config.ts** :
```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient() // ← Pour les appels API futurs
  ]
};
```

### ✅ Résultat Attendu

- ✅ Liste de produits affichée
- ✅ Recherche fonctionnelle (Two-Way Binding)
- ✅ Noms en majuscules (Pipe `uppercase`)
- ✅ Prix formatés en euros (Pipe `currency`)
- ✅ Affichage conditionnel avec `*ngIf`
- ✅ Service pour la logique métier

### 🎓 Points Clés à Retenir

1. **Components** = Structure UI réutilisable
2. **Data Binding** = Communication automatique Vue ↔ TS
3. **Directives** = Contrôle du DOM (`*ngIf`, `*ngFor`)
4. **Pipes** = Formatage des données (`currency`, `uppercase`)
5. **Services** = Logique métier partagée
6. **DI** = Injection automatique des dépendances

---

## 🚀 Prochaines Étapes

Une fois ces bases maîtrisées, tu peux passer à :

1. **Routing** : Navigation entre les pages
2. **Forms** : Formulaires réactifs (Reactive Forms)
3. **RxJS** : Programmation réactive (Observables)
4. **HTTP** : Communication avec les APIs
5. **State Management** : Gestion d'état (NgRx, Services)
6. **Testing** : Tests unitaires et d'intégration

**Bon courage dans ton apprentissage d'Angular !** 🎉

