import { Component, Input } from '@angular/core';
import { PostService } from 'src/app/core/services/post.service';

@Component({
  selector: 'LoveButton',
  templateUrl: './love-button.component.html',
  styleUrls: ['./love-button.component.scss'],
})
export class LoveButtonComponent {
  @Input() postId = ''
  @Input() isLoved = false;
  @Input({ required: true }) loveCount = 0;

  constructor(private postService: PostService) {}

  love() {
    this.isLoved = true;
    this.inclementCount();
    this.postService.likePost(this.postId)
      .subscribe({error:this.declementCount});
  }

  unlove() {
    this.isLoved = false;
    this.declementCount();
    this.postService.unlikePost(this.postId)
      .subscribe({error:this.inclementCount});
  }

  toggleLove() {
    if (!this.isLoved) {
      this.love();
    } else {
      this.unlove();
    }
  }

  private inclementCount = () =>  this.loveCount++
  private declementCount = () =>  this.loveCount--
}
