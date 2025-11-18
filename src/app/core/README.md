# 📁 Dossier Core - Architecture Angular

## 🎯 Qu'est-ce que le dossier Core ?

Le dossier **`core`** contient les **fonctionnalités globales** de l'application Angular. Ce sont des éléments qui :
- ✅ Sont utilisés dans **toute l'application**
- ✅ Sont chargés **une seule fois** au démarrage (singletons)
- ✅ Ne doivent **jamais être importés** par les features (sauf via `app.config.ts`)
- ✅ Contiennent la **logique globale** (authentification, interceptors, guards)

---

## 📂 Structure du Dossier Core

```
src/app/core/
├── interceptors/          # Intercepteurs HTTP globaux
├── guards/               # Guards de protection des routes
├── services/             # Services globaux (singletons)
├── models/               # Models/interfaces globaux
├── utils/                # Utilitaires et constantes
└── README.md            # Ce fichier
```

---

## 1️⃣ Interceptors (`core/interceptors/`)

### Rôle
Les **interceptors** interceptent **toutes les requêtes HTTP** avant qu'elles ne soient envoyées au serveur, et toutes les réponses avant qu'elles ne soient traitées.

### Ce qu'ils peuvent faire
- ✅ Ajouter des headers automatiquement (token d'authentification)
- ✅ Logger toutes les requêtes/réponses
- ✅ Gérer les erreurs HTTP globalement
- ✅ Modifier les requêtes selon des conditions
- ✅ Ajouter des paramètres par défaut

### Exemples de fichiers

#### `auth.interceptor.ts`
Ajoute automatiquement un token d'authentification à toutes les requêtes.

```typescript
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }
    
    return next.handle(req);
  }
}
```

#### `logging.interceptor.ts`
Enregistre toutes les requêtes et réponses pour le débogage.

#### `error.interceptor.ts`
Gère les erreurs HTTP globalement (401, 403, 500, etc.) et redirige si nécessaire.

#### `headers.interceptor.ts`
Ajoute des headers par défaut à toutes les requêtes.

### Configuration

Les interceptors sont configurés dans `app.config.ts` :

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

---

## 2️⃣ Guards (`core/guards/`)

### Rôle
Les **guards** protègent les **routes** en vérifiant si l'utilisateur peut y accéder avant que le composant ne se charge.

### Ce qu'ils peuvent faire
- ✅ Vérifier si l'utilisateur est connecté
- ✅ Vérifier les permissions (admin, rôle, etc.)
- ✅ Rediriger vers une autre page si non autorisé
- ✅ Bloquer l'accès à certaines routes

### Types de Guards

| Type | Interface | Usage |
|------|-----------|-------|
| **CanActivate** | `CanActivate` | Vérifie si on peut accéder à une route |
| **CanActivateChild** | `CanActivateChild` | Vérifie si on peut accéder aux routes enfants |
| **CanDeactivate** | `CanDeactivate` | Vérifie si on peut quitter une route |
| **CanLoad** | `CanLoad` | Vérifie si on peut charger un module lazy |

### Exemples de fichiers

#### `auth.guard.ts`
Vérifie si l'utilisateur est connecté avant d'accéder à une route.

```typescript
import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('authToken');
    
    if (token) {
      return true; // ✅ Autoriser l'accès
    } else {
      this.router.navigate(['/login']); // ❌ Rediriger vers login
      return false; // ❌ Bloquer l'accès
    }
  }
}
```

#### `admin.guard.ts`
Vérifie si l'utilisateur a le rôle admin.

```typescript
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  canActivate(): boolean {
    const role = localStorage.getItem('userRole');
    return role === 'admin';
  }
}
```

#### `role.guard.ts`
Vérifie si l'utilisateur a un rôle spécifique.

### Utilisation dans les routes

```typescript
// app.routes.ts
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard] // ← Guard appliqué
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard, AdminGuard] // ← Plusieurs guards
  }
];
```

---

## 3️⃣ Services (`core/services/`)

### Rôle
Les **services globaux** (singletons) contiennent la logique métier utilisée dans toute l'application.

### Caractéristiques
- ✅ Chargés **une seule fois** au démarrage
- ✅ Disponibles dans **toute l'application**
- ✅ Utilisent `providedIn: 'root'`
- ✅ Contiennent la logique globale (authentification, notifications, etc.)

### Exemples de fichiers

#### `auth.service.ts`
Service d'authentification global.

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ← Singleton global
})
export class AuthService {
  private apiUrl = 'https://api.example.com/auth';

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('authToken');
  }

  getCurrentUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}
```

#### `token.service.ts`
Gestion des tokens d'authentification.

```typescript
@Injectable({ providedIn: 'root' })
export class TokenService {
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  setToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  removeToken(): void {
    localStorage.removeItem('authToken');
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Vérifier si le token n'est pas expiré
    // (logique de décodage JWT, etc.)
    return true;
  }
}
```

#### `notification.service.ts`
Service de notifications globales (toasts, alerts, etc.).

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  showSuccess(message: string): void {
    // Afficher une notification de succès
    console.log('✅', message);
  }

  showError(message: string): void {
    // Afficher une notification d'erreur
    console.error('❌', message);
  }

  showInfo(message: string): void {
    // Afficher une notification d'information
    console.info('ℹ️', message);
  }
}
```

#### `storage.service.ts`
Service abstrait pour le stockage (localStorage, sessionStorage, etc.).

---

## 4️⃣ Models (`core/models/`)

### Rôle
Les **models globaux** définissent les interfaces et types utilisés dans toute l'application.

### Exemples de fichiers

#### `user.model.ts`
Interface User globale.

```typescript
export interface User {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
}

export interface LoginResponse {
  token: string;
  user: User;
  expiresIn: number;
}
```

#### `api-response.model.ts`
Interface pour les réponses API standardisées.

```typescript
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
```

#### `error.model.ts`
Interfaces pour les erreurs.

```typescript
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}
```

---

## 5️⃣ Utils (`core/utils/`)

### Rôle
Les **utilitaires** contiennent des fonctions et constantes globales réutilisables.

### Exemples de fichiers

#### `constants.ts`
Constantes globales de l'application.

```typescript
export const API_BASE_URL = 'https://api.example.com';
export const API_VERSION = 'v1';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  ADMIN: '/admin'
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  THEME: 'theme'
} as const;
```

#### `helpers.ts`
Fonctions utilitaires globales.

```typescript
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR').format(date);
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
```

#### `validators.ts`
Validateurs réutilisables.

---

## 📋 Règles Importantes

### ✅ À Faire

1. **Tout dans `core` doit être global** :
   - Services avec `providedIn: 'root'`
   - Interceptors configurés dans `app.config.ts`
   - Guards utilisés dans `app.routes.ts`

2. **Import uniquement depuis `app.config.ts` ou `app.routes.ts`** :
   ```typescript
   // ✅ CORRECT
   // app.config.ts
   import { AuthInterceptor } from './core/interceptors/auth.interceptor';
   ```

3. **Ne pas importer `core` dans les features** :
   ```typescript
   // ❌ MAUVAIS
   // features/posts/components/post-list.component.ts
   import { AuthService } from '../../core/services/auth.service';
   ```

### ❌ À Éviter

1. **Ne pas mettre de composants dans `core`** :
   - Les composants vont dans `shared/` ou `features/`

2. **Ne pas mettre de services métier dans `core`** :
   - Les services métier (PostService, UserService) vont dans `features/` ou `services/`

3. **Ne pas créer de dépendances circulaires** :
   - `core` ne doit pas importer depuis `features/` ou `shared/`

---

## 🔄 Différence entre Core, Shared et Features

| Dossier | Contenu | Usage | Exemple |
|---------|---------|-------|---------|
| **core/** | Services globaux, interceptors, guards | Fonctionnalités globales (singletons) | `AuthService`, `AuthGuard`, `AuthInterceptor` |
| **shared/** | Composants, pipes, directives réutilisables | Composants UI réutilisables | `ButtonComponent`, `CardComponent`, `TruncatePipe` |
| **features/** | Composants, services, models métier | Fonctionnalités métier spécifiques | `PostService`, `PostListComponent`, `PostModel` |

---

## 📊 Exemple de Structure Complète

```
src/app/
├── core/                          # ← Fonctionnalités globales
│   ├── interceptors/
│   │   ├── auth.interceptor.ts
│   │   ├── logging.interceptor.ts
│   │   └── error.interceptor.ts
│   │
│   ├── guards/
│   │   ├── auth.guard.ts
│   │   ├── admin.guard.ts
│   │   └── role.guard.ts
│   │
│   ├── services/
│   │   ├── auth.service.ts
│   │   ├── token.service.ts
│   │   └── notification.service.ts
│   │
│   ├── models/
│   │   ├── user.model.ts
│   │   └── api-response.model.ts
│   │
│   └── utils/
│       ├── constants.ts
│       └── helpers.ts
│
├── shared/                         # ← Composants réutilisables
│   ├── components/
│   │   ├── button/
│   │   └── card/
│   └── pipes/
│
└── features/                       # ← Features métier
    ├── posts/
    │   ├── components/
    │   ├── services/
    │   └── models/
    └── users/
        ├── components/
        ├── services/
        └── models/
```

---

## 🎯 Résumé

Le dossier **`core`** contient :

1. ✅ **Interceptors** : Interceptent toutes les requêtes HTTP
2. ✅ **Guards** : Protègent les routes
3. ✅ **Services globaux** : Logique métier globale (singletons)
4. ✅ **Models globaux** : Interfaces/types partagés
5. ✅ **Utils** : Fonctions et constantes globales

**Règle d'or** : Si c'est utilisé globalement et chargé une seule fois → **`core`**. Si c'est un composant UI réutilisable → **`shared`**. Si c'est une fonctionnalité métier → **`features`**.

---

## 📚 Ressources

- [Angular Style Guide - Core Module](https://angular.io/guide/styleguide#core-feature-module)
- [Angular Interceptors](https://angular.io/api/common/http/HttpInterceptor)
- [Angular Route Guards](https://angular.io/api/router/CanActivate)

