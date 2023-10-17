import { Injectable } from '@angular/core';
import { filter, map, switchMap } from 'rxjs';
import { PostAndAuthor, PostPreviewAndAuthor } from '../models/post-and-author';
import { PostAddDto, PostUpdateDto } from '../models/post-request';
import { PostRepositoryService } from '../repository/post-repository.service';
import { ImageRepositoryService } from '../repository/image-repository.service';
import { UserService } from './user.service';
import { Post, PostPreview } from '../models/post-response';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(
    private postRepo: PostRepositoryService,
    private imageRepo: ImageRepositoryService,
    private userService: UserService
  ) {}

  getAllPosts(size: number, pivot: string | null, author?: string) {
    return this.postRepo.getPosts(size, pivot, author).pipe(
      switchMap((response) => {
        const postPreviews = response.data?.collections || [];
        const authorIds = postPreviews.map(
          (postPreview) => postPreview.authorId
        );
        return this.mapPostPreviewsAndAuthors(postPreviews, authorIds);
      })
    );
  }

  mapPostPreviewsAndAuthors(postPreviews: PostPreview[], authorIds: string[]) {
    return this.userService.getUsers(authorIds).pipe(
      map((authors) =>
        postPreviews.map(
          (postPreview) =>
            ({
              postPreview: postPreview,
              author: authors.find(
                (author) => author.id === postPreview.authorId
              ),
            } as PostPreviewAndAuthor)
        )
      )
    );
  }

  getSinglePostById(id: string) {
    return this.postRepo.getPostById(id).pipe(
      filter((response) => response.isSuccess),
      switchMap((response) => {
        const post = response.data!;
        const authorId = post.authorId;
        return this.mapPostAndAuthor(post, authorId);
      })
    );
  }

  mapPostAndAuthor(post: Post, authorId: string) {
    return this.userService.getUser(authorId).pipe(
      map(
        (author) =>
          ({
            post: post,
            author: author,
          } as PostAndAuthor)
      )
    );
  }

  addPost(post: PostAddDto) {
    return this.postRepo.addPost(post);
  }

  deletePost(id: string) {
    return this.postRepo.deletePost(id);
  }

  updatePost(id: string, post: PostUpdateDto) {
    return this.postRepo.updatePost(id, post);
  }

  uploadImage(formData: FormData) {
    return this.imageRepo.uploadImage(formData);
  }

  likePost(id: string) {
    return this.postRepo.likePost(id);
  }

  unlikePost(id: string) {
    return this.postRepo.unlikePost(id);
  }

  savePost(id: string) {
    return this.postRepo.savePost(id).subscribe();
  }

  unsavePost(id: string) {
    return this.postRepo.unsavePost(id).subscribe();
  }
}
