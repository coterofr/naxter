import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../auth/guards/admin.guard';
import { LoginGuard } from '../auth/guards/login.guard';
import { UserDetailsComponent } from './components/user-details/user-details.component';
import { UserListComponent } from './components/user-list/user-list.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'list',
    component: UserListComponent,
    canActivate: [LoginGuard]
  },
  {
    path: ':id',
    component: UserDetailsComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule { }
