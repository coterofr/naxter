import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertService } from '../../../shared/services/alert.service';
import { ConstApi } from '../../../shared/utils/const-api';
import { User } from '../../../user/model/user';
import { RegisterUser } from '../../model/register-user';
import { AuthService } from '../../services/auth.service';

declare var bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  private registerUser: RegisterUser;
  private readonly ERROR_MESSAGE = 'exists';
  
  registerForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private router: Router) {
    this.registerUser = new RegisterUser('', '', '', '');

    this.registerForm = this.fb.group({
      name: new FormControl(this.registerUser.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]),
      email: new FormControl(this.registerUser.email, [
        Validators.required,
        Validators.pattern(ConstApi.EMAIL_FORMAT),
        Validators.minLength(10),
        Validators.maxLength(50),
      ]),
      userName: new FormControl(this.registerUser.userName, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      password: new FormControl(this.registerUser.password, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
    });
  }

  ngOnInit(): void {
    this.enableTooltips();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  get name(): FormControl {
    return this.registerForm.get('name') as FormControl;
  }

  get nameInvalid(): boolean | null {
    return this.name?.errors && (this.name?.touched || this.name?.dirty);
  }

  get email(): FormControl {
    return this.registerForm.get('email') as FormControl;
  }

  get emailInvalid(): boolean | null {
    return this.email?.errors && (this.email?.touched || this.email?.dirty);
  }

  get userName(): FormControl {
    return this.registerForm.get('userName') as FormControl;
  }

  get userNameInvalid(): boolean | null {
    return this.userName?.errors && (this.userName?.touched || this.userName?.dirty);
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  get passwordInvalid(): boolean | null {
    return this.password?.errors && (this.password?.touched || this.password?.dirty);
  }

  checkFormErrors(): void {
    Object.values(this.registerForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.registerForm.controls).forEach(control => control.setErrors({'invalid': true}));
  }

  showModalError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: this.translateService.instant("register.errors.title"),
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  async register(): Promise<void> {
    if(this.registerForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.registerUser.name = this.name?.value;
    this.registerUser.email = this.email?.value;
    this.registerUser.userName = this.userName?.value;
    this.registerUser.password = this.password?.value;

    this.authService.register(this.registerUser)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (user: User) => {
        await this.alertService.showAlert('alert-register', 'alert-register-text', true, this.translateService.instant('register.registered'));

        this.router.navigateByUrl('auth/login');
      },
      error => {
        this.showModalError(error !== null && error.error !== null && error.error.indexOf(this.ERROR_MESSAGE) < 0 ?
                            this.translateService.instant('register.errors.messageError') :
                            this.translateService.instant('register.errors.messageExists'));
      }
    );
  }
}
