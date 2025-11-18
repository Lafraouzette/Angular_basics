# 🌐 Cours : Communication & Backend dans Angular

**Objectif** : Maîtriser la communication avec les APIs, gérer les requêtes HTTP et utiliser RxJS pour la programmation réactive.

---

## 📋 Table des Matières

1. [HttpClient - Les Requêtes HTTP](#1-httpclient---les-requêtes-http)
2. [Interceptors - Intercepter les Requêtes](#2-interceptors---intercepter-les-requêtes)
3. [Observables (RxJS) - Programmation Réactive](#3-observables-rxjs---programmation-réactive)
4. [Exemples Pratiques Complets](#4-exemples-pratiques-complets)
5. [Bonnes Pratiques](#5-bonnes-pratiques)

---

## 1️⃣ HttpClient - Les Requêtes HTTP

### Qu'est-ce qu'HttpClient ?

**HttpClient** est le service Angular qui permet de faire des requêtes HTTP (GET, POST, PUT, DELETE) vers des APIs.

### Configuration

**1. Importer HttpClient dans `app.config.ts`** :

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient() // ← Nécessaire pour utiliser HttpClient
  ]
};
```

**2. Injecter HttpClient dans un Service** :

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {} // ← Injection
}
```

### Les 4 Méthodes HTTP Principales

| Méthode | Usage | Exemple |
|---------|-------|---------|
| **GET** | Récupérer des données | `http.get(url)` |
| **POST** | Créer une nouvelle ressource | `http.post(url, data)` |
| **PUT** | Mettre à jour complètement | `http.put(url, data)` |
| **DELETE** | Supprimer une ressource | `http.delete(url)` |

### 1. GET - Récupérer des Données

**Syntaxe** :
```typescript
get<T>(url: string, options?: {}): Observable<T>
```

**Exemples** :

```typescript
// Récupérer tous les posts
getPosts(): Observable<Post[]> {
  return this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts');
}

// Récupérer un post par ID
getPostById(id: number): Observable<Post> {
  return this.http.get<Post>(`https://jsonplaceholder.typicode.com/posts/${id}`);
}

// Avec paramètres de requête
searchPosts(query: string): Observable<Post[]> {
  const params = new HttpParams().set('q', query);
  return this.http.get<Post[]>('https://api.example.com/posts', { params });
}
```

**Utilisation dans un Component** :

```typescript
export class PostListComponent implements OnInit {
  posts: Post[] = [];

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts;
      },
      error: (error) => {
        console.error('Erreur:', error);
      }
    });
  }
}
```

### 2. POST - Créer une Ressource

**Syntaxe** :
```typescript
post<T>(url: string, body: any, options?: {}): Observable<T>
```

**Exemples** :

```typescript
// Créer un nouveau post
createPost(post: Omit<Post, 'id'>): Observable<Post> {
  return this.http.post<Post>(
    'https://jsonplaceholder.typicode.com/posts',
    post
  );
}

// Avec headers personnalisés
createPostWithAuth(post: Post): Observable<Post> {
  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token123'
  });
  
  return this.http.post<Post>(
    'https://api.example.com/posts',
    post,
    { headers }
  );
}
```

**Utilisation** :

```typescript
createPost() {
  const newPost = {
    title: 'Mon nouveau post',
    body: 'Contenu du post',
    userId: 1
  };

  this.postService.createPost(newPost).subscribe({
    next: (createdPost) => {
      console.log('Post créé:', createdPost);
      this.posts.push(createdPost);
    },
    error: (error) => {
      console.error('Erreur lors de la création:', error);
    }
  });
}
```

### 3. PUT - Mettre à Jour Complètement

**Syntaxe** :
```typescript
put<T>(url: string, body: any, options?: {}): Observable<T>
```

**Exemples** :

```typescript
// Mettre à jour un post (remplace toutes les propriétés)
updatePost(id: number, post: Post): Observable<Post> {
  return this.http.put<Post>(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    post
  );
}
```

**Utilisation** :

```typescript
updatePost() {
  const updatedPost = {
    id: 1,
    title: 'Titre modifié',
    body: 'Contenu modifié',
    userId: 1
  };

  this.postService.updatePost(1, updatedPost).subscribe({
    next: (post) => {
      console.log('Post mis à jour:', post);
    }
  });
}
```

### 4. DELETE - Supprimer une Ressource

**Syntaxe** :
```typescript
delete<T>(url: string, options?: {}): Observable<T>
```

**Exemples** :

```typescript
// Supprimer un post
deletePost(id: number): Observable<void> {
  return this.http.delete<void>(
    `https://jsonplaceholder.typicode.com/posts/${id}`
  );
}
```

**Utilisation** :

```typescript
deletePost(id: number) {
  this.postService.deletePost(id).subscribe({
    next: () => {
      console.log('Post supprimé');
      this.posts = this.posts.filter(p => p.id !== id);
    },
    error: (error) => {
      console.error('Erreur lors de la suppression:', error);
    }
  });
}
```

### PATCH - Mettre à Jour Partiellement

**Syntaxe** :
```typescript
patch<T>(url: string, body: any, options?: {}): Observable<T>
```

**Exemple** :

```typescript
// Mettre à jour seulement certaines propriétés
updatePostTitle(id: number, title: string): Observable<Post> {
  return this.http.patch<Post>(
    `https://jsonplaceholder.typicode.com/posts/${id}`,
    { title } // ← Seulement le titre
  );
}
```

### Options Avancées

```typescript
// Avec headers
const headers = new HttpHeaders({
  'Content-Type': 'application/json',
  'Authorization': 'Bearer token'
});

// Avec paramètres
const params = new HttpParams()
  .set('page', '1')
  .set('limit', '10');

// Requête complète avec options
this.http.get<Post[]>('https://api.example.com/posts', {
  headers: headers,
  params: params,
  observe: 'response', // ← Pour obtenir la réponse complète (headers, status, etc.)
  responseType: 'json'
}).subscribe(response => {
  console.log('Status:', response.status);
  console.log('Headers:', response.headers);
  console.log('Body:', response.body);
});
```

---

## 2️⃣ Interceptors - Intercepter les Requêtes

### Qu'est-ce qu'un Interceptor ?

Un **Interceptor** est un middleware qui intercepte toutes les requêtes HTTP avant qu'elles ne soient envoyées, et toutes les réponses avant qu'elles ne soient traitées.

**Cas d'usage** :
- ✅ Ajouter un token d'authentification à toutes les requêtes
- ✅ Logger toutes les requêtes/réponses
- ✅ Gérer les erreurs globalement
- ✅ Ajouter des headers par défaut

### Structure d'un Interceptor

```typescript
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class MyInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Modifier la requête avant l'envoi
    const modifiedReq = req.clone({
      // modifications
    });

    // Passer la requête au prochain handler
    return next.handle(modifiedReq);
  }
}
```

### 1. Interceptor d'Authentification

Ajoute automatiquement un token d'authentification à toutes les requêtes.

**auth.interceptor.ts** :

```typescript
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Récupérer le token (depuis localStorage, service, etc.)
    const token = localStorage.getItem('authToken');

    // Si un token existe, l'ajouter au header
    if (token) {
      const clonedReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(clonedReq);
    }

    // Sinon, passer la requête telle quelle
    return next.handle(req);
  }
}
```

**Configuration dans `app.config.ts`** :

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // ← Important : permet plusieurs interceptors
    }
  ]
};
```

**Alternative avec fonction (Angular 15+)** :

```typescript
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('authToken');
  
  if (token) {
    const clonedReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(clonedReq);
  }
  
  return next(req);
};

// Dans app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([authInterceptor])
    )
  ]
};
```

### 2. Interceptor de Logging

Enregistre toutes les requêtes et réponses pour le débogage.

**logging.interceptor.ts** :

```typescript
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const startTime = Date.now();

    // Logger la requête
    console.log(`[HTTP] ${req.method} ${req.url}`);

    return next.handle(req).pipe(
      tap({
        next: (event) => {
          if (event instanceof HttpResponse) {
            const duration = Date.now() - startTime;
            console.log(
              `[HTTP] ${req.method} ${req.url} - ${event.status} (${duration}ms)`
            );
          }
        },
        error: (error) => {
          const duration = Date.now() - startTime;
          console.error(
            `[HTTP ERROR] ${req.method} ${req.url} - ${error.status} (${duration}ms)`,
            error
          );
        }
      })
    );
  }
}
```

### 3. Interceptor de Gestion d'Erreurs

Gère les erreurs HTTP globalement (401, 403, 500, etc.).

**error.interceptor.ts** :

```typescript
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Une erreur est survenue';

        if (error.error instanceof ErrorEvent) {
          // Erreur côté client
          errorMessage = `Erreur: ${error.error.message}`;
        } else {
          // Erreur côté serveur
          switch (error.status) {
            case 401:
              errorMessage = 'Non autorisé. Veuillez vous connecter.';
              // Rediriger vers la page de connexion
              this.router.navigate(['/login']);
              break;
            case 403:
              errorMessage = 'Accès interdit.';
              break;
            case 404:
              errorMessage = 'Ressource non trouvée.';
              break;
            case 500:
              errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
              break;
            default:
              errorMessage = `Erreur ${error.status}: ${error.message}`;
          }
        }

        console.error('Erreur HTTP:', errorMessage);
        
        // Tu peux aussi afficher une notification à l'utilisateur
        // this.notificationService.showError(errorMessage);

        return throwError(() => error);
      })
    );
  }
}
```

### 4. Interceptor pour Ajouter des Headers par Défaut

**headers.interceptor.ts** :

```typescript
import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeadersInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Ajouter des headers par défaut
    const clonedReq = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
      }
    });

    return next.handle(clonedReq);
  }
}
```

### Configuration de Plusieurs Interceptors

L'ordre d'exécution est important ! Les interceptors s'exécutent dans l'ordre où ils sont déclarés.

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HeadersInterceptor,    // ← 1. Ajoute les headers
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,        // ← 2. Ajoute le token
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptor,     // ← 3. Log les requêtes
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,       // ← 4. Gère les erreurs
      multi: true
    }
  ]
};
```

---

## 3️⃣ Observables (RxJS) - Programmation Réactive

### Qu'est-ce qu'un Observable ?

Un **Observable** est un flux de données asynchrone. Il émet des valeurs au fil du temps et peut être souscrit (écouté).

**Analogie** : C'est comme une chaîne YouTube - tu t'abonnes et tu reçois les nouvelles vidéos quand elles sont publiées.

### Concepts de Base

#### 1. Subscribe - S'abonner à un Observable

```typescript
// Un Observable ne fait rien tant qu'on ne s'y abonne pas
this.postService.getPosts().subscribe({
  next: (posts) => {
    // Traiter les données reçues
    console.log('Posts reçus:', posts);
  },
  error: (error) => {
    // Gérer les erreurs
    console.error('Erreur:', error);
  },
  complete: () => {
    // Appelé quand l'Observable se termine
    console.log('Terminé');
  }
});
```

**Syntaxe courte** :

```typescript
// Si tu ne gères que le succès
this.postService.getPosts().subscribe(posts => {
  console.log(posts);
});
```

#### 2. map - Transformer les Données

Transforme chaque valeur émise par l'Observable.

```typescript
import { map } from 'rxjs/operators';

getPosts(): Observable<Post[]> {
  return this.http.get<Post[]>('https://api.example.com/posts').pipe(
    map(posts => posts.map(post => ({
      ...post,
      title: post.title.toUpperCase(), // ← Transformer le titre
      createdAt: new Date(post.createdAt) // ← Convertir en Date
    })))
  );
}
```

**Exemple pratique** :

```typescript
// Transformer un tableau d'utilisateurs
getUsers(): Observable<User[]> {
  return this.http.get<User[]>('https://api.example.com/users').pipe(
    map(users => users.map(user => ({
      ...user,
      fullName: `${user.firstName} ${user.lastName}`,
      isActive: user.status === 'active'
    })))
  );
}
```

#### 3. switchMap - Changer d'Observable

Annule la requête précédente et passe à une nouvelle.

**Cas d'usage** : Recherche en temps réel (quand l'utilisateur tape)

```typescript
import { switchMap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

export class SearchComponent {
  private searchSubject = new Subject<string>();

  constructor(private postService: PostService) {
    // Écouter les changements de recherche
    this.searchSubject.pipe(
      debounceTime(300), // ← Attendre 300ms après la dernière frappe
      distinctUntilChanged(), // ← Ignorer si la valeur n'a pas changé
      switchMap(query => {
        // Annule la requête précédente si une nouvelle arrive
        return this.postService.searchPosts(query);
      })
    ).subscribe(posts => {
      this.posts = posts;
    });
  }

  onSearch(query: string) {
    this.searchSubject.next(query);
  }
}
```

**Exemple : Récupérer un post puis ses commentaires** :

```typescript
getPostWithComments(postId: number): Observable<PostWithComments> {
  return this.postService.getPostById(postId).pipe(
    switchMap(post => {
      // Une fois le post récupéré, récupérer les commentaires
      return this.commentService.getComments(postId).pipe(
        map(comments => ({
          ...post,
          comments: comments
        }))
      );
    })
  );
}
```

#### 4. catchError - Gérer les Erreurs

Intercepte les erreurs et retourne une valeur par défaut ou un autre Observable.

```typescript
import { catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

getPosts(): Observable<Post[]> {
  return this.http.get<Post[]>('https://api.example.com/posts').pipe(
    catchError(error => {
      console.error('Erreur lors de la récupération:', error);
      
      // Option 1 : Retourner une valeur par défaut
      return of([]); // ← Retourne un tableau vide
      
      // Option 2 : Retourner un Observable d'erreur
      // return throwError(() => new Error('Impossible de charger les posts'));
      
      // Option 3 : Retourner des données de secours
      // return of([{ id: 0, title: 'Post par défaut', body: '...' }]);
    })
  );
}
```

**Exemple avec retry** :

```typescript
import { retry, catchError } from 'rxjs/operators';

getPosts(): Observable<Post[]> {
  return this.http.get<Post[]>('https://api.example.com/posts').pipe(
    retry(3), // ← Réessayer 3 fois en cas d'erreur
    catchError(error => {
      console.error('Erreur après 3 tentatives:', error);
      return of([]);
    })
  );
}
```

### Opérateurs RxJS Courants

| Opérateur | Usage | Exemple |
|-----------|-------|---------|
| `map` | Transformer chaque valeur | `map(x => x * 2)` |
| `filter` | Filtrer les valeurs | `filter(x => x > 10)` |
| `switchMap` | Changer d'Observable | `switchMap(id => getById(id))` |
| `mergeMap` | Fusionner plusieurs Observables | `mergeMap(id => getById(id))` |
| `catchError` | Gérer les erreurs | `catchError(err => of([]))` |
| `retry` | Réessayer en cas d'erreur | `retry(3)` |
| `debounceTime` | Attendre avant d'émettre | `debounceTime(300)` |
| `distinctUntilChanged` | Ignorer les valeurs identiques | `distinctUntilChanged()` |
| `take` | Prendre N valeurs | `take(5)` |
| `tap` | Effet de bord (logging) | `tap(x => console.log(x))` |

### Combinaison d'Opérateurs

```typescript
import { map, filter, catchError, retry, tap } from 'rxjs/operators';

getActivePosts(): Observable<Post[]> {
  return this.http.get<Post[]>('https://api.example.com/posts').pipe(
    retry(2), // ← Réessayer 2 fois
    tap(posts => console.log('Posts reçus:', posts.length)), // ← Logger
    map(posts => posts.filter(post => post.isActive)), // ← Filtrer
    catchError(error => {
      console.error('Erreur:', error);
      return of([]); // ← Valeur par défaut
    })
  );
}
```

### Async Pipe - S'abonner dans le Template

Au lieu de `subscribe()` dans le component, tu peux utiliser `async` pipe dans le template.

**Component** :
```typescript
export class PostListComponent {
  posts$ = this.postService.getPosts(); // ← Observable directement
}
```

**Template** :
```html
<div *ngIf="posts$ | async as posts">
  <div *ngFor="let post of posts">
    {{ post.title }}
  </div>
</div>
```

**Avantages** :
- ✅ Gestion automatique de l'unsubscribe
- ✅ Moins de code dans le component
- ✅ Meilleure performance

---

## 4️⃣ Exemples Pratiques Complets

### Exemple 1 : Service CRUD Complet

**post.service.ts** :

```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError, retry } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) {}

  // GET - Récupérer tous les posts
  getPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    return this.http.get<Post[]>(this.apiUrl, { params }).pipe(
      retry(2),
      map(posts => posts.map(post => ({
        ...post,
        title: post.title.charAt(0).toUpperCase() + post.title.slice(1)
      }))),
      catchError(error => {
        console.error('Erreur lors de la récupération:', error);
        return throwError(() => error);
      })
    );
  }

  // GET - Récupérer un post par ID
  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error(`Erreur lors de la récupération du post ${id}:`, error);
        return throwError(() => error);
      })
    );
  }

  // POST - Créer un post
  createPost(post: Omit<Post, 'id'>): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post).pipe(
      catchError(error => {
        console.error('Erreur lors de la création:', error);
        return throwError(() => error);
      })
    );
  }

  // PUT - Mettre à jour un post
  updatePost(id: number, post: Partial<Post>): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post).pipe(
      catchError(error => {
        console.error('Erreur lors de la mise à jour:', error);
        return throwError(() => error);
      })
    );
  }

  // DELETE - Supprimer un post
  deletePost(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError(error => {
        console.error('Erreur lors de la suppression:', error);
        return throwError(() => error);
      })
    );
  }
}
```

### Exemple 2 : Component avec Gestion d'État

**post-list.component.ts** :

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { PostService } from '../../services/post.service';
import { Post } from '../../models/post.model';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html'
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  error: string | null = null;
  
  private destroy$ = new Subject<void>(); // ← Pour gérer les subscriptions

  constructor(private postService: PostService) {}

  ngOnInit() {
    this.loadPosts();
  }

  ngOnDestroy() {
    // Détruire toutes les subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPosts() {
    this.isLoading = true;
    this.error = null;

    this.postService.getPosts()
      .pipe(takeUntil(this.destroy$)) // ← Se désabonner automatiquement
      .subscribe({
        next: (posts) => {
          this.posts = posts;
          this.isLoading = false;
        },
        error: (error) => {
          this.error = 'Impossible de charger les posts';
          this.isLoading = false;
        }
      });
  }

  createPost(post: Omit<Post, 'id'>) {
    this.postService.createPost(post)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (createdPost) => {
          this.posts.unshift(createdPost);
        },
        error: (error) => {
          this.error = 'Erreur lors de la création';
        }
      });
  }
}
```

### Exemple 3 : Recherche avec Debounce

**search.component.ts** :

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { PostService } from '../services/post.service';
import { Subject, debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html'
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  results: Post[] = [];
  isLoading = false;
  
  private destroy$ = new Subject<void>();

  constructor(private postService: PostService) {}

  ngOnInit() {
    // Écouter les changements du champ de recherche
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // ← Attendre 300ms
      distinctUntilChanged(), // ← Ignorer si identique
      switchMap(query => {
        this.isLoading = true;
        return this.postService.searchPosts(query || '');
      }),
      takeUntil(this.destroy$)
    ).subscribe({
      next: (posts) => {
        this.results = posts;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erreur:', error);
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 5️⃣ Bonnes Pratiques

### ✅ À Faire

1. **Toujours gérer les erreurs** :
   ```typescript
   .subscribe({
     next: (data) => { /* ... */ },
     error: (error) => { /* Gérer l'erreur */ }
   });
   ```

2. **Se désabonner pour éviter les memory leaks** :
   ```typescript
   private destroy$ = new Subject<void>();
   
   ngOnInit() {
     this.service.getData()
       .pipe(takeUntil(this.destroy$))
       .subscribe();
   }
   
   ngOnDestroy() {
     this.destroy$.next();
     this.destroy$.complete();
   }
   ```

3. **Utiliser async pipe quand possible** :
   ```html
   <div *ngIf="posts$ | async as posts">
     <!-- ... -->
   </div>
   ```

4. **Centraliser les appels API dans des services** :
   - ✅ Un service par domaine (PostService, UserService, etc.)
   - ✅ Réutilisable entre plusieurs composants

5. **Utiliser des interceptors pour les besoins globaux** :
   - Authentification
   - Logging
   - Gestion d'erreurs

### ❌ À Éviter

1. **Ne pas oublier de se désabonner** :
   ```typescript
   // ❌ Mauvaise pratique
   ngOnInit() {
     this.service.getData().subscribe(); // ← Memory leak !
   }
   ```

2. **Ne pas faire d'appels HTTP directement dans les composants** :
   ```typescript
   // ❌ Mauvaise pratique
   constructor(private http: HttpClient) {}
   
   // ✅ Bonne pratique
   constructor(private postService: PostService) {}
   ```

3. **Ne pas ignorer les erreurs** :
   ```typescript
   // ❌ Mauvaise pratique
   this.service.getData().subscribe(data => {
     // Pas de gestion d'erreur
   });
   ```

4. **Ne pas créer plusieurs subscriptions pour la même donnée** :
   ```typescript
   // ❌ Mauvaise pratique
   ngOnInit() {
     this.service.getData().subscribe(); // Subscription 1
     this.service.getData().subscribe(); // Subscription 2 (duplication)
   }
   
   // ✅ Bonne pratique
   ngOnInit() {
     this.data$ = this.service.getData(); // Une seule source
   }
   ```

---

## 📊 Résumé Visuel

```
┌─────────────────────────────────────────┐
│         COMPONENT                        │
│  - État de la vue                       │
│  - Gestion UI                           │
│  - Subscribe aux Observables            │
└─────────────────────────────────────────┘
         ↑
         │ Utilise
         │
┌─────────────────────────────────────────┐
│         SERVICE                          │
│  - Appels HTTP (GET, POST, PUT, DELETE) │
│  - Transformation des données (map)     │
│  - Gestion d'erreurs (catchError)       │
└─────────────────────────────────────────┘
         ↑
         │ Passe par
         │
┌─────────────────────────────────────────┐
│         INTERCEPTORS                    │
│  - Auth (ajouter token)                 │
│  - Logging                              │
│  - Gestion d'erreurs globales           │
└─────────────────────────────────────────┘
         ↑
         │ Requête HTTP
         │
┌─────────────────────────────────────────┐
│         API / BACKEND                    │
│  - Retourne les données                 │
└─────────────────────────────────────────┘
```

---

## 🎯 Points Clés à Retenir

1. ✅ **HttpClient** : Service pour les requêtes HTTP (GET, POST, PUT, DELETE)
2. ✅ **Interceptors** : Middleware pour intercepter/modifier les requêtes
3. ✅ **Observables** : Flux de données asynchrones
4. ✅ **Opérateurs RxJS** : `map`, `switchMap`, `catchError`, etc.
5. ✅ **Gestion des erreurs** : Toujours gérer les erreurs
6. ✅ **Memory leaks** : Toujours se désabonner (`takeUntil`, `async pipe`)

**Avec ces concepts, tu peux créer des applications Angular robustes qui communiquent efficacement avec des APIs !** 🚀

