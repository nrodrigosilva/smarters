import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { CommentService } from '../../services/comment.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { Comment } from '../../models/comment.model';
import { CommentFormComponent } from '../comment-form/comment-form.component';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CommentFormComponent],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: Post | null = null;
  author: User | null = null;
  comments: Comment[] = [];
  loading = true;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _postService: PostService,
    private _userService: UserService,
    private _commentService: CommentService
  ) {}

  ngOnInit(): void {
    this._route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          if (isNaN(id)) {
            this._router.navigate(['/']);
            return [];
          }
          return this._postService.getPostById(id);
        })
      )
      .subscribe({
        next: (post) => {
          this.post = post;
          this.loadAuthor();
          this.loadComments();
        },
        error: (error) => {
          console.error('Erro ao caregar post:', error);
          this.loading = false;
        },
      });
  }

  loadAuthor(): void {
    if (this.post) {
      this._userService.getUserById(this.post.userId).subscribe({
        next: (_user) => {
          this.author = _user;
        },
        error: (error) => {
          console.error('Erro ao caregar autor:', error);
        },
      });
    }
  }

  loadComments(): void {
    if (this.post) {
      this._commentService.getCommentsByPost(this.post.id).subscribe({
        next: (_comments) => {
          this.comments = _comments;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao carregar comentário:', error);
          this.loading = false;
        },
      });
    }
  }

  onCommentAdded(comment: Comment): void {
    this.comments.unshift(comment);
  }
}
