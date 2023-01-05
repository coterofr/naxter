import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { Cart } from '../../model/cart';
import { MerchandisingService } from '../../services/merchandising.service';
import { Product } from './../../model/product';

declare var bootstrap: any;

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {

  private id!: string;
  private cart: Cart;

  product: Product;
  inCart: boolean | null;

  constructor(private merchandisingService: MerchandisingService,
              private jwtTokenService: JwtTokenService,
              private router: Router,
              private route: ActivatedRoute) {
    this.product = new Product('', '', '', 0, 0, '', null, null, new Date());
    this.cart = new Cart('', null, null);
    this.inCart = null;
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private async initData() {
    const paramMap: ParamMap = await firstValueFrom(this.route.paramMap);
    this.id = paramMap.get('id') as string;    

    this.product = await firstValueFrom(this.merchandisingService.getProduct(this.id));

    this.merchandisingService.getCart(this.loggedUser).subscribe((cart: Cart) => {
      this.cart = cart;

      if(this.cart && this.cart.products && this.cart.products.length > 0) {
        this.inCart = this.cart.products.filter(productCart => productCart.id === this.product.id).length > 0;
      }
    });
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  return() {
    this.router.navigateByUrl('merchandising/products');
  }
}
