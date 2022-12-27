import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { debounceTime, distinctUntilChanged, Observable, share, startWith, Subject, switchMap } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import { User } from 'src/app/user/model/user';
import { UserService } from 'src/app/user/services/user.service';
import { Cart } from '../../model/cart';
import { Product } from '../../model/product';
import { MerchandisingService } from '../../services/merchandising.service';
import { Merchandising } from './../../model/merchandising';

declare var bootstrap: any;

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {

  private searchProduct: Subject<string> = new Subject();

  products$: Observable<Product[]> = new Observable<Product[]>();
  merchandisings: Merchandising[];
  cart: Cart;
  user: User;
  
  searchMerchandising: string[] = [];
  searchName: string = '';
  searchUser: string = '';
  loading: boolean = true;

  constructor(private merchandisingService: MerchandisingService,
              private userService: UserService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService) {       
    this.products$ = this.searchProduct.pipe(startWith(''),
                                             debounceTime(500),
                                             distinctUntilChanged(),
                                             switchMap((query: any) => {
                                              this.loading = false;

                                              return this.merchandisingService.searchProducts(this.searchMerchandising, this.searchName, this.searchUser);
                                            }),
                                            share());
    this.merchandisings = [];
    this.cart = new Cart('', null, null);
    this.user = new User('', '', '', '', false, 0, [], null, null, false);
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private initData(): void {
    this.userService.getUser(this.loggedUser).subscribe((user: User) => {
      this.user = user;
    });

    this.merchandisingService.getMerchandisings().subscribe((merchandisings: Merchandising[]) => {
      this.merchandisings = merchandisings;
    });

    this.merchandisingService.getCart(this.loggedUser).subscribe((cart: Cart) => {
      this.cart = cart;
    });
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get isConsumer(): boolean {
    return this.jwtTokenService.isConsumer();
  }

  get isProducer(): boolean {
    return this.jwtTokenService.isProducer();
  }

  get isMerchandisingActive(): boolean {
    return this.user.merchandising;
  }

  searchProductsByMerchandising() {
    this.loading = true;
    this.searchProduct.next(this.searchMerchandising.toString());
  }

  searchProductsByName() {
    this.loading = true;
    this.searchProduct.next(this.searchName);
  }

  searchProductsByUser() {
    this.loading = true;
    this.searchProduct.next(this.searchUser);
  }

  async deleteProduct(id: string) {
    this.searchProduct.next(id);

    await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('product.deleted'));
  }

  async addProductCart(cart: Cart) {
    this.cart = cart;

    await this.alertService.showAlert('alert-add', 'alert-add-text', true, this.translateService.instant('product.added'));
  }

  async removeProductCart(id: string) {
    if(this.cart && this.cart.products) {
      this.cart.products = this.cart.products?.filter(product => product.id !== id);

      await this.alertService.showAlert('alert-remove', 'alert-remove-text', true, this.translateService.instant('product.removed'));
    }
  }
}
