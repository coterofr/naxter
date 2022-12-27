import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import Swal from 'sweetalert2';
import { Product } from '../../model/product';
import { MerchandisingService } from '../../services/merchandising.service';
import { CartUser } from './../../model/cart-user';

declare var bootstrap: any;

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() product: Product;
  @Output() removeProduct: EventEmitter<string>;

  constructor(private merchandisingService: MerchandisingService,
              private jwtTokenService: JwtTokenService,
              private translateService: TranslateService) {
    this.product = new Product('', '', '', 0, 0, '', null, null, new Date());
    this.removeProduct = new EventEmitter<string>();
  }

  ngOnInit(): void {
    this.enableTooltips();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  showModalError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: this.translateService.instant("cart.errors.titleRemoved"),
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  remove(): void {
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
          this.removeProduct.emit(removed.id);
        },
        error => {
          this.showModalError(this.translateService.instant('cart.errors.message'));
        });
      }
    });
  }
}
