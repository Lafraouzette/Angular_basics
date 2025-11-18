import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Post } from '../../models/post.model';
import { PostService } from '../../services/post.service';

// VIEWMODEL - Le composant TypeScript = ViewModel
@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // ========== ÉTAT DE LA VUE (ViewModel) ==========
  posts: Post[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Pour le formulaire (Two-Way Binding)
  newPost: Omit<Post, 'id'> = {
    userId: 1,
    title: '',
    body: ''
  };
  
  editingPost: Post | null = null;
  showForm = false;

  // Injection du service pour communiquer avec le Model
  constructor(private postService: PostService) {}

  // ========== INITIALISATION ==========
  ngOnInit(): void {
    this.loadPosts();
  }

  // ========== MÉTHODES DU VIEWMODEL ==========
  
  // READ - Charger tous les posts
  loadPosts(): void {
    this.isLoading = true;
    this.error = null;
    
    this.postService.getPosts().subscribe({
      next: (posts) => {
        this.posts = posts.slice(0, 10); // Limiter à 10 pour l'exemple
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des posts';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  // CREATE - Créer un nouveau post
  createPost(): void {
    if (!this.newPost.title || !this.newPost.body) {
      this.error = 'Veuillez remplir tous les champs';
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.postService.createPost(this.newPost).subscribe({
      next: (post) => {
        this.posts.unshift(post); // Ajouter au début de la liste
        this.resetForm();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la création du post';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  // UPDATE - Mettre à jour un post
  updatePost(): void {
    if (!this.editingPost) return;

    this.isLoading = true;
    this.error = null;

    this.postService.updatePost(this.editingPost.id, this.editingPost).subscribe({
      next: (updatedPost) => {
        const index = this.posts.findIndex(p => p.id === updatedPost.id);
        if (index !== -1) {
          this.posts[index] = updatedPost;
        }
        this.cancelEdit();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la mise à jour du post';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  // DELETE - Supprimer un post
  deletePost(id: number): void {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce post ?')) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.postService.deletePost(id).subscribe({
      next: () => {
        this.posts = this.posts.filter(p => p.id !== id);
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors de la suppression du post';
        this.isLoading = false;
        console.error('Erreur:', err);
      }
    });
  }

  // Méthodes pour gérer le formulaire
  startEdit(post: Post): void {
    this.editingPost = { ...post };
    this.showForm = true;
  }

  cancelEdit(): void {
    this.editingPost = null;
    this.showForm = false;
    this.resetForm();
  }

  resetForm(): void {
    this.newPost = {
      userId: 1,
      title: '',
      body: ''
    };
    this.showForm = false;
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.cancelEdit();
    }
  }
}

