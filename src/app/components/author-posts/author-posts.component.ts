import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-author-posts',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './author-posts.component.html',
  styleUrls: ['./author-posts.component.scss'],
})
export class AuthorPostsComponent implements OnInit {
  author: User | null = null;
  posts: Post[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getAuthor();
  }

  getAuthor() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = Number(params.get('id'));
          if (isNaN(id)) {
            this.router.navigate(['/']);
            return [];
          }
          return this.userService.getUserById(id);
        }),
        switchMap((user) => {
          this.author = user;
          return this.postService.getPostsByUser(user.id);
        })
      )
      .subscribe({
        next: (posts) => {
          this.posts = posts;
          this.loading = false;
        },
        error: (error) => {
          console.error('Erro ao caregar autor:', error);
          this.loading = false;
        },
      });
  }
}
