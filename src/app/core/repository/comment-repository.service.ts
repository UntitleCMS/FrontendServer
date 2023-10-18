import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Comment, CommentRequest } from '../models/comment';
import { map, tap } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommentRepositoryService {
  #BASE_URL = environment.baseUrl;
  #COMMENT_ENDPOINT = new URL('/api/comment/v1/comments', this.#BASE_URL);

  constructor(private http: HttpClient) {}

  getCommentsByPostId(postId: string) {
    return this.http.get<Comment[]>(`${this.#COMMENT_ENDPOINT}/${postId}`);
  }

  getCommentByPostId(postId: string, commentId: string) {
    return this.http.get<Comment>(
      `${this.#COMMENT_ENDPOINT}/${postId}/${commentId}`
    );
  }

  addCommentToPostId(postId: string, req: CommentRequest) {
    return this.http
      .post<Comment[]>(`${this.#COMMENT_ENDPOINT}/${postId}`, req)
      .pipe(map((res) => res[0]));
  }

  editCommentInPostId(postId: string, req: CommentRequest) {
    return this.http.put<Comment>(`${this.#COMMENT_ENDPOINT}/${postId}`, req);
  }

  deleteCommentInPostId(postId: string, commentId: string) {
    return this.http.delete<Comment>(
      `${this.#COMMENT_ENDPOINT}/${postId}/${commentId}`
    );
  }
}
