import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { UserService } from '../../services/user.service';
import { Post } from '../../models/post.model';
import { User } from '../../models/user.model';
import { PaginationComponent } from '../pagination/pagination.component';
import {
  debounceTime,
  distinctUntilChanged,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, PaginationComponent],
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss'],
})
export class PostListComponent implements OnInit {
  posts: Post[] = [];
  userMap: { [key: number]: User } = {};
  loading = true;
  currentPage = 1;
  totalPages = 10;
  itemsPerPage = 10;
  searchTerm = '';
  viewMode: 'grid' | 'list' = 'grid';

  private searchSubject = new Subject<string>();

  constructor(
    private _postService: PostService,
    private _userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadPosts();

    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(() => (this.loading = true)),
        switchMap((term) => {
          if (term) {
            return this._postService.searchPosts(term);
          } else {
            return this._postService.getPosts(
              this.currentPage,
              this.itemsPerPage
            );
          }
        })
      )
      .subscribe({
        next: (posts) => {
          this.posts = posts;
          this.loading = false;
          this.loadUserInfo();
        },
        error: (error) => {
          console.error('Error searching posts:', error);
          this.loading = false;
        },
      });
  }

  loadPosts(): void {
    this.loading = true;
    this._postService.getPosts(this.currentPage, this.itemsPerPage).subscribe({
      next: (_posts) => {
        this.posts = _posts;
        this.loading = false;
        this.loadUserInfo();
      },
      error: (error) => {
        console.error('Erro ao carregar post:', error);
        this.loading = false;
      },
    });
  }

  loadUserInfo(): void {
    const userIds = [...new Set(this.posts.map((post) => post.userId))];

    userIds.forEach((userId) => {
      if (!this.userMap[userId]) {
        this._userService.getUserById(userId).subscribe({
          next: (_user) => {
            this.userMap[userId] = _user;
          },
          error: (error) => {
            console.error(`Erro ao caregar usuários ${userId}:`, error);
          },
        });
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.searchTerm) {
      this.onSearch();
    } else {
      this.loadPosts();
    }
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.loadPosts();
  }
}
