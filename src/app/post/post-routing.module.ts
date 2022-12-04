import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../auth/guards/login.guard';
import { ProducerGuard } from './../auth/guards/producer.guard';
import { HomeComponent } from './components/home/home.component';
import { PostDetailsComponent } from './components/post-details/post-details.component';
import { PostListComponent } from './components/post-list/post-list.component';
import { PostPublishComponent } from './components/post-publish/post-publish.component';

const routes: Routes = [
  {
    path: '',
    component: PostListComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'list',
    component: PostListComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'new',
    component: PostPublishComponent,
    canActivate: [ProducerGuard]
  },
  {
    path: ':id/edit',
    component: PostPublishComponent,
    canActivate: [ProducerGuard]
  },
  {
    path: ':id/detail',
    component: PostDetailsComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PostRoutingModule { }
