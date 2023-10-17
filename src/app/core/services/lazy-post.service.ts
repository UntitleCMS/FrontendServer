import { Injectable } from '@angular/core';
import { BehaviorSubject, tap } from 'rxjs';
import { PostPreviewAndAuthor } from '../models/post-and-author';
import { PostService } from './post.service';

@Injectable({
  providedIn: 'root',
})
export class LazyPostService {
  posts$: BehaviorSubject<PostPreviewAndAuthor[]>;
  pivot$: BehaviorSubject<string | null>;

  constructor(private postService: PostService) {
    this.posts$ = new BehaviorSubject<PostPreviewAndAuthor[]>([]);
    this.pivot$ = new BehaviorSubject<string | null>(null);
  }

  loadMore(
    author?: string,
    callback: () => void = () => {},
    zeroLengthHandler: () => void = () => {}
  ) {
    this.postService
      .getAllPosts(20, this.pivot$.value, author)
      .pipe(
        tap((posts) => {
          if (posts.length > 0) {
            const lastPostPreview = posts[posts.length - 1].postPreview;
            this.pivot$.next(lastPostPreview.id);
            this.posts$.next([...this.posts$.value, ...posts]);
          } else {
            zeroLengthHandler();
          }
        })
      )
      .subscribe({
        complete: () => callback(),
      });
  }
}
