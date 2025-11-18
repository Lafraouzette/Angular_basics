import { Routes } from '@angular/router';

import { PostListComponent } from './components/post-list/post-list.component';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'posts',
    pathMatch: 'full'
  },
  { 
    path: "posts", 
    component: PostListComponent  // Route pour l'exemple CRUD avec MVVM
  }
];
