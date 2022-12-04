import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Observable, share, startWith, Subject, switchMap } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Post } from './../../model/post';
import { PostService } from './../../services/post.service';

declare var bootstrap: any;

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.scss']
})
export class PostListComponent implements OnInit {

  private searchPost: Subject<string> = new Subject();

  posts$: Observable<Post[]> = new Observable<Post[]>();
  
  searchTheme: string = '';
  searchName: string = '';
  searchUser: string = '';

  constructor(private postService: PostService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService) {       
    this.posts$ = this.searchPost.pipe(startWith(''),
                                       debounceTime(500),
                                       distinctUntilChanged(),
                                       switchMap((query: any) => this.postService.searchPosts(this.searchTheme, this.searchName, this.searchUser)),
                                       share());
  }

  ngOnInit(): void {
    this.enableTooltips();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get isProducer(): boolean {
    return this.jwtTokenService.isProducer();
  }

  searchPostsByTheme() {
    this.searchPost.next(this.searchTheme);
  }

  searchPostsByName() {
    this.searchPost.next(this.searchName);
  }

  searchPostsByUser() {
    this.searchPost.next(this.searchUser);
  }

  async deletePost(id: string) {
    this.searchPost.next(id);

    await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('post.deleted'));
  }
}
