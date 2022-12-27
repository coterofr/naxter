import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { Product } from '../../model/product';
import { MerchandisingService } from '../../services/merchandising.service';
import { Cart } from './../../model/cart';

declare var bootstrap: any;

@Component({
  selector: 'app-cart-list',
  templateUrl: './cart-list.component.html',
  styleUrls: ['./cart-list.component.scss']
})
export class CartListComponent implements OnInit {

  products: Product[];
  totalPrice: number;
  loading: boolean = true;

  constructor(private merchandisingService: MerchandisingService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService) {
    this.products = [];
    this.totalPrice = 0;
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  private calcTotalPrice() {
    this.totalPrice = 0;
    if(this.products && this.products.length > 0) {
      this.products.forEach(product => {
        this.totalPrice += product.price;
      });
    }
  }

  private initData(): void {
    this.merchandisingService.getCart(this.loggedUser).subscribe((cart: Cart) => {
      this.loading = false;

      if(cart && cart.products && cart.products.length > 0) {
        this.products = cart.products;
      }

      this.calcTotalPrice();
    });
  }

  async removeProduct(id: string) {
    if(this.products && this.products.length > 0) {
      this.products = this.products.filter(product => product.id !== id);

      this.calcTotalPrice();

      await this.alertService.showAlert('alert-remove', 'alert-remove-text', true, this.translateService.instant('product.removed'));
    }
  }
}
