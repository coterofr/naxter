import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { StarRatingComponent } from 'ng-starrating';
import { firstValueFrom } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { Post } from '../../model/post';
import { AlertService } from './../../../shared/services/alert.service';
import { PostService } from './../../services/post.service';

declare var bootstrap: any;

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.scss']
})
export class PostDetailsComponent implements OnInit {

  private id!: string;
  private home!: string;
  
  post: Post;

  rating = 0;
  totalStars: number = 10;

  constructor(private postService: PostService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
    this.post = new Post('', '', '', null, null, new Date(), false, '', null, 0);
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
    const paramMap: ParamMap = await firstValueFrom(this.route.paramMap);
    this.id = paramMap.get('id') as string;
    const queryMap: ParamMap = await firstValueFrom(this.route.queryParamMap);
    this.home = queryMap.get('return') as string;     

    this.post = await firstValueFrom(this.postService.getPost(this.id));

    this.rating = this.post.rating;
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get isLoggedProducer(): boolean {
    return this.jwtTokenService.isProducer();
  }

  get isLoggedPost(): boolean {
    return this.loggedUser === this.post.user?.name;
  }

  onRate($event: { oldValue: number, newValue: number, starRating: StarRatingComponent }) {
    this.postService.ratePost(this.post.id, $event.newValue).subscribe(async (post: Post) => {
      this.post = post;
      this.rating = this.post.rating;

      await this.alertService.showAlert('alert-rating', 'alert-rating-text', true, this.translateService.instant('post.rated', {oldValue: $event.oldValue, newValue: this.rating}));
    });
  }

  return() {
    if(this.home) {
      this.router.navigateByUrl('posts/home');
    } else {
      this.router.navigateByUrl('posts/list');
    }
  }
}
