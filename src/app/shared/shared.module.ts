import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PaginationComponent } from './components/pagination/pagination.component';
import { CutTextPipe } from './pipes/cut-text.pipe';

@NgModule({
  declarations: [
    HeaderComponent,
    FooterComponent,
    PaginationComponent,
    CutTextPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    TranslateModule
  ],
  exports: [
      HeaderComponent,
      FooterComponent,
      PaginationComponent,
      CutTextPipe
  ]
})
export class SharedModule { }
