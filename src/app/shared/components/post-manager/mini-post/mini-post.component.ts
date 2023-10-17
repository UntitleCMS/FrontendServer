import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AuthorityService } from 'src/app/core/auth/authority.service';
import { PostPreviewAndAuthor } from 'src/app/core/models/post-and-author';
import { TagService } from 'src/app/core/services/tag.service';

@Component({
  selector: 'MiniPost',
  templateUrl: './mini-post.component.html',
  styleUrls: ['./mini-post.component.scss'],
})
export class MiniPostComponent implements OnInit {
  @Input() ppa!: PostPreviewAndAuthor;
  @Output() deleteEmitter = new EventEmitter();
  @Input() hideProfile: boolean = false;
  isOwned = false;

  constructor(private authService: AuthorityService, private tagService: TagService) {}

  checkImage(imageString: string) {
    if (!imageString.length) return 'assets/images/default-image.svg';
    return imageString;
  }

  ngOnInit(): void {
    this.isOwned = this.ppa.author.id === this.authService.user_id;

  }
  sendDeleteEvent() {
    this.deleteEmitter.emit();
  }

  getTagColor(tagName: string) {
    return this.tagService.getColorFromTagName(tagName);
  }
}
