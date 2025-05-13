import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
    const params = new HttpParams()
      .set('_page', page.toString())
      .set('_limit', limit.toString());

    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params });
  }

  searchPosts(term: string): Observable<Post[]> {
    const params = new HttpParams().set('q', term);
    return this.http.get<Post[]>(`${this.apiUrl}/posts`, { params });
  }

  getPostById(id: number): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/posts/${id}`);
  }

  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/users/${userId}/posts`);
  }
}
