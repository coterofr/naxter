import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../model/post';
import { PostService } from '../../services/post.service';
import { User } from './../../../user/model/user';

declare var bootstrap: any;

@Component({
  selector: 'app-post-subscription',
  templateUrl: './post-subscription.component.html',
  styleUrls: ['./post-subscription.component.scss']
})
export class PostSubscriptionComponent implements OnInit {

  @Input() author: User;

  posts: Post[];

  totalStars: number = 10;
  readonly: boolean = true;

  constructor(private postService: PostService) {
    this.author = new User('', '', '', '', false, 0, [], null, null, false);
    this.posts = [];
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private async initData() {
    this.postService.getTopPostsByAuthor(this.author.name).subscribe((posts: Post[]) => this.posts = posts);
  }
}
