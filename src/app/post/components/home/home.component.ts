import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/user/model/user';
import { UserService } from 'src/app/user/services/user.service';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';
import { Post } from '../../model/post';
import { PostService } from '../../services/post.service';

declare var bootstrap: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  posts: Post[];
  authors: User[];

  constructor(private postService: PostService,
              private userService: UserService,
              private jwtTokenService: JwtTokenService) {
    this.posts = [];
    this.authors = [];
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private initData(): void {
    this.postService.getTopPosts().subscribe((posts: Post[]) => {
      this.posts = posts
    });

    if(this.isLogged && this.loggedUser) {
      this.userService.getSubscribedAuthors(this.loggedUser).subscribe((authors: User[]) => this.authors = authors);
    }
  }

  get loggedUser(): string | null {
    return this.jwtTokenService.getName();
  }

  get isLogged(): boolean {
    return this.jwtTokenService.isLogged();
  } 
}
