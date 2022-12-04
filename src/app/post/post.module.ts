import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RatingModule } from 'ng-starrating';
import { SharedModule } from '../shared/shared.module';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';
import { HomeComponent } from './components/home/home.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { PostItemComponent } from './components/post-item/post-item.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostPublishComponent } from './components/post-publish/post-publish.component';
import { PostSliderComponent } from './components/post-slider/post-slider.component';
import { PostSubscriptionComponent } from './components/post-subscription/post-subscription.component';
import { PostRoutingModule } from './post-routing.module';

@NgModule({
  declarations: [
    HomeComponent,
    PostListComponent,
    PostItemComponent,
    PostPublishComponent,
    PostDetailsComponent,
    CommentListComponent,
    CommentItemComponent,
    PostSubscriptionComponent,
    PostSliderComponent
  ],
  imports: [
    CommonModule,
    PostRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    RatingModule
  ]
})
export class PostModule { }
