import { Routes } from '@angular/router';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { AuthorPostsComponent } from './components/author-posts/author-posts.component';

export const routes: Routes = [
  { path: '', component: PostListComponent },
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'author/:id', component: AuthorPostsComponent },
  { path: '**', redirectTo: '' },
];
