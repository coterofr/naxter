import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProducerGuard } from '../auth/guards/producer.guard';
import { ThemeDetailsComponent } from './components/theme-details/theme-details.component';
import { ThemeListComponent } from './components/theme-list/theme-list.component';

const routes: Routes = [
  {
    path: ':user/list',
    component: ThemeListComponent,
    canActivate: [ProducerGuard]
  },
  {
    path: 'new',
    component: ThemeDetailsComponent,
    canActivate: [ProducerGuard]
  },
  {
    path: ':id/detail',
    component: ThemeDetailsComponent,
    canActivate: [ProducerGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule { }
