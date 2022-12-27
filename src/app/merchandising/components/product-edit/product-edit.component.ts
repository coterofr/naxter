import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import Swal from 'sweetalert2';
import { MerchandisingService } from '../../services/merchandising.service';
import { Product } from './../../model/product';
import { ProductMerch } from './../../model/product-merch';

declare var bootstrap: any;

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.scss']
})
export class ProductEditComponent implements OnInit {

  private product: Product;
  private productMerch: ProductMerch;

  id!: string;
  update: boolean = false;
  
  productForm: FormGroup;


  constructor(private fb: FormBuilder,
              private merchandisingService: MerchandisingService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router) {
    this.product = new Product('', '', '', 0, 0, '', null, null, new Date());
    this.productMerch = new ProductMerch('', '', '', 0, 0, '', '');
    this.productForm = this.fb.group({
      name: new FormControl(''),
      merchandising: new FormControl(''),
      description: new FormControl(''),
      price: new FormControl(0.0),
      stock: new FormControl(1)
    });
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initForm();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }
  
  private async initForm() {
    const paramMap: ParamMap = await firstValueFrom(this.route.paramMap);

    if(paramMap.get('id')) {
      this.update = true;
      this.id = paramMap.get('id') as string;
      this.product = await firstValueFrom(this.merchandisingService.getProduct(this.id));

      this.productMerch = new ProductMerch(this.product.id, this.product.name, this.product.description, this.product.price, this.product.stock, 
                                           this.loggedUser, this.product.merchandising?.name as string);
                                   
    } else {
      this.update = false;
      this.productMerch = new ProductMerch('', '', '', 0.0, 1, this.loggedUser, '');
    }

    this.productForm = this.fb.group({
      name: new FormControl(this.productMerch.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25)
      ]),
      merchandising: new FormControl(this.productMerch.merchandising, [
        Validators.required
      ]),
      description: new FormControl(this.productMerch.description, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(500)
      ]),
      price: new FormControl(this.productMerch.price, [
        Validators.required,
        Validators.min(0.5),
        Validators.max(1000)
      ]),
      stock: new FormControl(this.productMerch.stock, [
        Validators.required,
        Validators.min(1),
        Validators.max(100),
        Validators.pattern("^[0-9]*$")
      ]),
    });
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get name(): FormControl {
    return this.productForm.get('name') as FormControl;
  }

  get nameInvalid(): boolean | null {
    return this.name?.errors && (this.name?.touched || this.name?.dirty);
  }

  get description(): FormControl {
    return this.productForm.get('description') as FormControl;
  }

  get descriptionInvalid(): boolean | null {
    return this.description?.errors && (this.description?.touched || this.description?.dirty);
  }

  get merchandising(): FormControl {
    return this.productForm.get('merchandising') as FormControl;
  }

  get merchandisingInvalid(): boolean | null {
    return this.merchandising?.errors && (this.merchandising?.touched || this.merchandising?.dirty);
  }

  get price(): FormControl {
    return this.productForm.get('price') as FormControl;
  }

  get priceInvalid(): boolean | null {
    return this.price?.errors && (this.price?.touched || this.price?.dirty);
  }

  get stock(): FormControl {
    return this.productForm.get('stock') as FormControl;
  }

  get stockInvalid(): boolean | null {
    return this.stock?.errors && (this.stock?.touched || this.stock?.dirty);
  }

  checkFormErrors(): void {
    Object.values(this.productForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.productForm.controls).forEach(control => control.setErrors({'invalid': true}));
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

  async save(): Promise<void> {
    if(this.productForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.productMerch.id = this.id;
    this.productMerch.name = this.name?.value;
    this.productMerch.description = this.description?.value;
    this.productMerch.price = this.price?.value;
    this.productMerch.stock = this.stock?.value;
    this.productMerch.user = this.loggedUser;
    this.productMerch.merchandising = this.merchandising?.value;

    if(this.id) {
      this.edit();
    } else {
      this.create();
    }
  }

  private create(): void {
    this.merchandisingService.addProduct(this.productMerch)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (product: Product) => {
        this.product =  product;
        this.id = product.id;
        this.update = true;

        await this.alertService.showAlert('alert-product', 'alert-product-text', true, this.translateService.instant('product.created'));
      },
      error => {
        this.showModalError(this.translateService.instant("product.errors.titleCreated"), this.translateService.instant('product.errors.message'));
      }
    );
  }

  private edit(): void {
    this.merchandisingService.editProduct(this.productMerch.id, this.productMerch)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (product: Product) => {
        this.product = product;

        await this.alertService.showAlert('alert-product', 'alert-product-text', true, this.translateService.instant('product.updated'));
      },
      error => {
        this.showModalError(this.translateService.instant("product.errors.titleUpdated"), this.translateService.instant('product.errors.message'));
      }
    );
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
        this.merchandisingService.deleteProduct(this.product.id).subscribe(async (deleted: {id: string}) => {
          await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('product.deleted'));

          this.router.navigateByUrl('merchandising/products');
        },
        error => {
          this.showModalError(this.translateService.instant("product.errors.titleDeleted"), this.translateService.instant('product.errors.message'));
        });
      }
    });
  }
}
