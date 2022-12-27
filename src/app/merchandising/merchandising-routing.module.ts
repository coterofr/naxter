import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerGuard } from '../auth/guards/consumer.guard';
import { ProducerGuard } from '../auth/guards/producer.guard';
import { CartListComponent } from './components/cart-list/cart-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ProductEditComponent } from './components/product-edit/product-edit.component';
import { ProductListComponent } from './components/product-list/product-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProductListComponent,
    canActivate: [ConsumerGuard]
  },
  {
    path: 'products',
    component: ProductListComponent,
    canActivate: [ConsumerGuard]
  },
  {
    path: 'products/new',
    component: ProductEditComponent,
    canActivate: [ProducerGuard]
  },
  {
    path: 'products/:id/edit',
    component: ProductEditComponent,
    canActivate: [ProducerGuard]
  },
  {
    path: ':products/:id/detail',
    component: ProductDetailsComponent,
    canActivate: [ConsumerGuard]
  },
  {
    path: ':id/cart',
    component: CartListComponent,
    canActivate: [ConsumerGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MerchandisingRoutingModule { }
