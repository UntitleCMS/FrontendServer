import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { AuthorityService } from 'src/app/core/auth/authority.service';
import type { PostPreviewAndAuthor } from 'src/app/core/models/post-and-author';
import { LazyPostService } from 'src/app/core/services/lazy-post.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent {
  userStatus = false;
  title = 'กำเนิดโปรแกรมเมอร์';
  description =
    'เบต้าบล็อกให้บริการในการเขียนบทความในรูปแบบบล็อก โดยอำนวยความสะดวกให้โปรแกรมเมอร์โดยการเพิ่มฟังก์ชันในการเขียนโค้ด และสั่งให้โค้ดทำงาน ขณะนี้ ระบบของเราให้บริการในภาษา C, C++, Python, Java';

  ppas: PostPreviewAndAuthor[] = [];

  @ViewChild('postgroup') postgroup!: ElementRef<HTMLElement>;
  readyStatus = true;
  endLoad = false;

  constructor(
    private authorityService: AuthorityService,
    private lazyPostService: LazyPostService
  ) {}

  ngOnInit(): void {
    this.authorityService.isLoggedin$.subscribe(
      (userStatus) => (this.userStatus = userStatus)
    );
    this.lazyPostService.posts$
      .asObservable()
      .subscribe((r) => (this.ppas = r));
    this.lazyPostService.loadMore();
  }

  postTrackBy(index: number, item: PostPreviewAndAuthor) {
    return item.postPreview.id;
  }

  removeFromId(id: string) {
    this.ppas.splice(
      this.ppas.findIndex((item) => item.postPreview.id === id),
      1
    );
  }

  @HostListener('window:scroll', ['$event'])
  scrollEvent() {
    if (
      window.scrollY + window.innerHeight >
        this.postgroup.nativeElement.offsetHeight &&
      this.readyStatus &&
      !this.endLoad &&
      this.ppas.length
    ) {
      this.readyStatus = false;
      this.loadPostOnScroll();
    }
  }

  loadPostOnScroll() {
    setTimeout(
      () =>
        this.lazyPostService.loadMore(
          undefined,
          () => (this.readyStatus = true),
          () => (this.endLoad = true)
        ),
      1000
    );
  }
}
