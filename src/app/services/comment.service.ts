import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private apiUrl = 'https://jsonplaceholder.typicode.com';

  constructor(private http: HttpClient) {}

  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/posts/${postId}/comments`);
  }

  addComment(comment: Omit<Comment, 'id'>): Observable<Comment> {
    return this.http.post<Comment>(`${this.apiUrl}/comments`, comment);
  }
}
