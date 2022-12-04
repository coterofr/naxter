import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { AlertService } from '../../../shared/services/alert.service';
import { JwtToken } from '../../model/jwt-token';
import { LoginUser } from '../../model/login-user';
import { AuthService } from '../../services/auth.service';
import { JwtTokenService } from '../../services/jwt-token.service';

declare var bootstrap: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  private loginUser: LoginUser;
  private readonly ERROR_MESSAGE = 'block';
  
  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private router: Router) {
    this.loginUser = new LoginUser('', '');

    this.loginForm = this.fb.group({
      name: new FormControl(this.loginUser.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]),
      password: new FormControl(this.loginUser.password, [
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
    return this.loginForm.get('name') as FormControl;
  }

  get nameInvalid(): boolean | null {
    return this.name?.errors && (this.name?.touched || this.name?.dirty);
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  get passwordInvalid(): boolean | null {
    return this.password?.errors && (this.password?.touched || this.password?.dirty);
  }

  checkFormErrors(): void {
    Object.values(this.loginForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.loginForm.controls).forEach(control => control.setErrors({'invalid': true}));
  }

  showModalError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: this.translateService.instant('login.errors.title'),
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  async login(): Promise<void> {
    if(this.loginForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.loginUser.name = this.name?.value;
    this.loginUser.password = this.password?.value;

    this.authService.login(this.loginUser)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (jwtToken: JwtToken) => {
        await this.alertService.showAlert('alert-login', 'alert-login-text', true, this.translateService.instant('login.logged'));

        this.jwtTokenService.setJwtToken(jwtToken.token);
        this.router.navigateByUrl('posts/home');
      },
      error => {
        this.showModalError(error !== null && error.error !== null && error.error.indexOf(this.ERROR_MESSAGE) < 0 ?
                            this.translateService.instant('login.errors.messageError') :
                            this.translateService.instant('login.errors.messageBlock'));
      }
    );
  }
}
