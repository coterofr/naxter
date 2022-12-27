import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ProductItemComponent } from './components/product-item/product-item.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { MerchandisingRoutingModule } from './merchandising-routing.module';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { CartItemComponent } from './components/cart-item/cart-item.component';

@NgModule({
  declarations: [
    ProductListComponent,
    ProductItemComponent,
    ProductDetailsComponent,
    ProductEditComponent,
    CartListComponent,
    CartItemComponent
  ],
  imports: [
    CommonModule,
    MerchandisingRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    SharedModule
  ]
})
export class MerchandisingModule { }
