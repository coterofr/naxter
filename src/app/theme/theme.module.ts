import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ThemeDetailsComponent } from '../theme/components/theme-details/theme-details.component';
import { ThemeItemComponent } from '../theme/components/theme-item/theme-item.component';
import { ThemeListComponent } from '../theme/components/theme-list/theme-list.component';
import { ThemeRoutingModule } from './theme-routing.module';

@NgModule({
  declarations: [
    ThemeListComponent,
    ThemeItemComponent,
    ThemeDetailsComponent,
  ],
  imports: [
    CommonModule,
    ThemeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
  ]
})
export class ThemeModule { }
