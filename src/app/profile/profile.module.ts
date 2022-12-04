import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RatingModule } from 'ng-starrating';
import { SharedModule } from '../shared/shared.module';
import { AccountComponent } from './components/account/account.component';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';
import { ProfileListComponent } from './components/profile-list/profile-list.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
  declarations: [
    ProfileListComponent,
    ProfileDetailsComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule,
    RatingModule
  ]
})
export class ProfileModule { }
