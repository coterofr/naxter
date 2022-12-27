import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import Swal from 'sweetalert2';
import { Cart } from '../../model/cart';
import { CartUser } from '../../model/cart-user';
import { MerchandisingService } from '../../services/merchandising.service';
import { Product } from './../../model/product';

declare var bootstrap: any;

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent implements OnInit {

  @Input() product: Product;
  @Input() cart: Cart;

  @Output() deleteProduct: EventEmitter<string>;
  @Output() addProductCart: EventEmitter<Cart>;
  @Output() removeProductCart: EventEmitter<string>;

  canAdd: boolean = false;
  canRemove: boolean = false;

  constructor(private merchandisingService: MerchandisingService,
              private jwtTokenService: JwtTokenService,
              private translateService: TranslateService) {
    this.product = new Product('', '', '', 0, 0, '', null, null, new Date());
    this.cart = new Cart('', null, null);
    
    this.deleteProduct = new EventEmitter<string>();
    this.addProductCart = new EventEmitter<Cart>();
    this.removeProductCart = new EventEmitter<string>();
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
    if(this.cart && this.cart.products && this.cart.products.length > 0) {
      this.canRemove = this.cart.products.filter(productCart => productCart.id === this.product.id).length > 0;
      this.canAdd = !this.canRemove;
    } else {
      this.canRemove = false;
      this.canAdd = true;
    }
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get isConsumer(): boolean {
    return this.jwtTokenService.isConsumer();
  }

  get isModerator(): boolean {
    return this.jwtTokenService.isModerator();
  }

  get canEdit(): boolean {
    return this.product.user?.name === this.loggedUser;
  }

  get canDelete(): boolean {
    return this.product.user?.name === this.loggedUser || this.isModerator;
  }

  addCart(): void {
    let cartUser: CartUser = new CartUser(this.loggedUser, this.product.id);
    this.merchandisingService.addProductCart(this.loggedUser, cartUser).subscribe((cart: Cart) => {
      this.canRemove = true;
      this.canAdd = false;

      this.addProductCart.emit(cart);
    });
  }

  showModalError(title: string, message: string): void {
    Swal.fire({
      icon: 'error',
      title: title,
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  removeCart(): void {
    Swal.fire({
      
      icon: 'question',
      title: this.translateService.instant('cart.confirmRemove.title'),
      text: this.translateService.instant('cart.confirmRemove.message'),
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('cart.buttons.remove.title'),
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('generic.buttons.cancel'),
      cancelButtonColor: '#0d6efd'

    }).then(async (result) => {
      if(result.isConfirmed) {
        let cartUser: CartUser = new CartUser(this.loggedUser, this.product.id);
        this.merchandisingService.removeProductCart(this.loggedUser, cartUser).subscribe((removed: {id: string}) => {
          this.canRemove = false;
          this.canAdd = true;

          this.removeProductCart.emit(removed.id);
        },
        error => {
          this.showModalError(this.translateService.instant("cart.errors.titleRemoved"), this.translateService.instant('cart.errors.message'));
        });
      }
    });
  }

  delete(): void {
    Swal.fire({
      
      icon: 'question',
      title: this.translateService.instant('product.confirmDelete.title'),
      text: this.translateService.instant('product.confirmDelete.message'),
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('product.buttons.delete.title'),
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('generic.buttons.cancel'),
      cancelButtonColor: '#0d6efd'

    }).then(async (result) => {
      if(result.isConfirmed) {
        this.merchandisingService.deleteProduct(this.product.id).subscribe((deleted: {id: string}) => {
          this.deleteProduct.emit(deleted.id);
        },
        error => {
          this.showModalError(this.translateService.instant("product.errors.titleDeleted"), this.translateService.instant('product.errors.message'));
        });
      }
    });
  }
}
