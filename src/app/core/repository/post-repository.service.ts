import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Response } from '../models/response';
import { Pageable } from '../models/pageable';
import { Post, PostPreview } from '../models/post-response';
import { PostAddDto, PostUpdateDto } from '../models/post-request';

@Injectable({
  providedIn: 'root',
})
export class PostRepositoryService {
  #BASE_URL = new URL('http://localhost:4200');
  #POST_ENDPOINT = new URL('/api/article/v1/articles', this.#BASE_URL);

  constructor(private http: HttpClient) {}

  getPosts(size: number = 20, pivot: string | null = null, author?: string) {
    let endpoint = new URL(this.#POST_ENDPOINT);
    endpoint.searchParams.set('take', size.toString());
    if (pivot) {
      endpoint.searchParams.set('from', '>' + pivot);
    }
    if (author) {
      endpoint.searchParams.set('of', author);
    }

    return this.http.get<Response<Pageable<PostPreview[]>>>(
      endpoint.toString()
    );
  }

  getPostById(id: string) {
    return this.http.get<Response<Post>>(`${this.#POST_ENDPOINT}/${id}`);
  }

  addPost(post: PostAddDto) {
    return this.http.post<Response<string>>(
      this.#POST_ENDPOINT.toString(),
      post
    );
  }

  deletePost(id: string) {
    return this.http.delete<Response<string>>(`${this.#POST_ENDPOINT}/${id}`);
  }

  updatePost(id: string, post: PostUpdateDto) {
    return this.http.put<Response<string>>(
      `${this.#POST_ENDPOINT}/${id}`,
      post
    );
  }

  likePost(id: string) {
    return this.http.patch(`${this.#POST_ENDPOINT}/${id}/like`, {})
  }

  unlikePost(id: string) {
    return this.http.patch(`${this.#POST_ENDPOINT}/${id}/unlike`, {})
  }

  savePost(id: string) {
    return this.http.patch(`${this.#POST_ENDPOINT}/${id}/save`, {})
  }

  unsavePost(id: string) {
    return this.http.patch(`${this.#POST_ENDPOINT}/${id}/unsave`, {})
  }
}
