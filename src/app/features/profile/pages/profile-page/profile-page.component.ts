import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { AuthorityService } from 'src/app/core/auth/authority.service';
import { PostPreviewAndAuthor } from 'src/app/core/models/post-and-author';
import { User } from 'src/app/core/models/user';
import { LazyPostService } from 'src/app/core/services/lazy-post.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss'],
  providers: [LazyPostService]
})
export class ProfilePageComponent implements OnInit {
  author: User | undefined;
  isMyId = false;

  loadPostsProxy: ()=>void = ()=>{};
  posts: PostPreviewAndAuthor[] = [];

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private auth: AuthorityService,
    private lazyPostService: LazyPostService
  ) {}

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          let authorId = params.get('authorId');
          if (authorId) return this.userService.getUser(authorId);
          return of(undefined);
        })
      )
      .subscribe((author) => {
        this.author = author;
        this.isMyId = this.auth.user_id === this.author?.id;
        this.loadPostsProxy = ()=> this.loadPosts(author?.id);
        this.listenPostChange();
      });
  }

  getAvatar() {
    return '/api/img/v1/avatar/' + this.author?.id;
  }

  private loadPosts(author?:string){
    this.lazyPostService.loadMore(author)
  }

  listenPostChange(){
    this.lazyPostService.posts$
      .asObservable()
      .pipe(tap(console.log)).subscribe({
        next: p=>{this.posts = p}
      });
    this.loadPostsProxy();
  }

  postTrackBy(index: number, item: PostPreviewAndAuthor) {
      return item.postPreview.id;
  }

  removeFromId(id: string) {
    this.posts.splice(
      this.posts.findIndex((item) => item.postPreview.id === id),
      1
    );
  }
}
