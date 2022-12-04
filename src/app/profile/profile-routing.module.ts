import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from '../auth/guards/login.guard';
import { AccountComponent } from './components/account/account.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileListComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'list',
    component: ProfileListComponent,
    canActivate: [LoginGuard]
  },
  {
    path: ':id',
    component: ProfileDetailsComponent,
    canActivate: [LoginGuard]
  },
  {
    path: ':id/account',
    component: AccountComponent,
    canActivate: [LoginGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule { }
