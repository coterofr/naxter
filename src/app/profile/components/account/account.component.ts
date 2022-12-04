import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { JwtToken } from '../../../auth/model/jwt-token';
import { AuthService } from '../../../auth/services/auth.service';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ConstApi } from '../../../shared/utils/const-api';
import { User } from '../../../user/model/user';
import { RoleService } from '../../../user/services/role.service';
import { UserService } from '../../../user/services/user.service';
import { Account } from '../../model/account';
import { Profile } from '../../model/profile';
import { ProfileService } from '../../services/profile.service';

declare var bootstrap: any;

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  private account: Account;
  
  user: User;
  profileForm: FormGroup;

  totalStars: number = 10;
  readonly: boolean = true;

  private readonly ERROR_MESSAGE = 'exists';

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private profileService: ProfileService,
              private roleService: RoleService,
              private authService: AuthService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private router: Router) {
    this.user = new User('', '', '', '', false, 0, [], null, null, null);
    this.account = new Account('', '', '', '', new Date(), 0, 0);
    this.profileForm = this.fb.group({
      name: new FormControl(''),
      email: new FormControl(''),
      userName: new FormControl(''),
      description: new FormControl(''),
      dateBirth: new FormControl(formatDate(new Date(), ConstApi.DATE_FORMAT, ConstApi.DATE_LOCALE))
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

  private async initForm(): Promise<void> {
    const name: string | null = this.jwtTokenService.getName() as string;
    this.user = await firstValueFrom(this.profileService.getAccount(name));
    const profile: Profile = this.user.profile as Profile;
    this.account = new Account(this.user.name, this.user.email, this.user.userName, profile.description, profile.dateBirth, profile.visits, this.user.rating);

    this.profileForm = this.fb.group({
      name: new FormControl(this.account.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]),
      email: new FormControl(this.account.email, [
        Validators.required,
        Validators.pattern(ConstApi.EMAIL_FORMAT),
        Validators.minLength(10),
        Validators.maxLength(50),
      ]),
      userName: new FormControl(this.account.userName, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
      description: new FormControl(this.account.description, [
        Validators.maxLength(500),
      ]),
      dateBirth: this.account.dateBirth !== null ? new FormControl(formatDate(this.account.dateBirth, ConstApi.DATE_FORMAT, ConstApi.DATE_LOCALE)) :
                                                   new FormControl(formatDate(new Date(), ConstApi.DATE_FORMAT, ConstApi.DATE_LOCALE))
    });
  }

  get name(): FormControl {
    return this.profileForm.get('name') as FormControl;
  }

  get nameInvalid(): boolean | null {
    return this.name?.errors && (this.name?.touched || this.name?.dirty);
  }

  get email(): FormControl {
    return this.profileForm.get('email') as FormControl;
  }

  get emailInvalid(): boolean | null {
    return this.email?.errors && (this.email?.touched || this.email?.dirty);
  }

  get userName(): FormControl {
    return this.profileForm.get('userName') as FormControl;
  }

  get userNameInvalid(): boolean | null {
    return this.userName?.errors && (this.userName?.touched || this.userName?.dirty);
  }

  get description(): FormControl {
    return this.profileForm.get('description') as FormControl;
  }

  get descriptionInvalid(): boolean | null {
    return this.description?.errors && (this.description?.touched || this.description?.dirty);
  }

  get dateBirth(): FormControl {
    return this.profileForm.get('dateBirth') as FormControl;
  }

  get dateBirthInvalid(): boolean | null {
    return this.dateBirth?.errors && (this.dateBirth?.touched || this.dateBirth?.dirty);
  }

  get isConsumer(): boolean {
    return this.jwtTokenService.isConsumer();
  }

  get isProducer(): boolean {
    return this.jwtTokenService.isProducer();
  }

  get visits(): number {
    return this.user.profile?.visits as number;
  }

  get role(): string | null {
    const role: string = this.jwtTokenService.getRole() as string;

    return this.roleService.getRoleName(role);
  }

  private refreshJwtToken(): void {
    this.authService.refreshByName(this.user.name).subscribe((jwtTokenRefresh: JwtToken) => {
      if(jwtTokenRefresh) {
        this.jwtTokenService.setJwtToken(jwtTokenRefresh.token);
      }
    });
  }

  changeGenericRole(): void {
    this.userService.changeGenericRole(this.user.name).subscribe((user: User) => {
      this.user = user

      this.refreshJwtToken();
    });
  }

  checkFormErrors(): void {
    Object.values(this.profileForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.profileForm.controls).forEach(control => control.setErrors({'invalid': true}));
  }

  showModalError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: this.translateService.instant("admin.user.errors.title"),
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  async save(): Promise<void> {
    if(this.profileForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.account.name = this.name?.value;
    this.account.email = this.email?.value;
    this.account.userName = this.userName?.value;
    this.account.description = this.description?.value;
    this.account.dateBirth = this.dateBirth?.value;

    this.profileService.editAccount(this.user.name, this.account)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (user: User) => {
        if(this.user.name === user.name) {
          this.user = user;
        } else {
          this.user = user;
          this.refreshJwtToken();
        }

        await this.alertService.showAlert('alert-profile', 'alert-profile-text', true, this.translateService.instant('account.saved'));
      },
      error => {
        this.showModalError(error !== null && error.error !== null && error.error.indexOf(this.ERROR_MESSAGE) < 0 ?
                            this.translateService.instant('account.errors.messageError') :
                            this.translateService.instant('account.errors.messageExists'));
      }
    );
  }

  delete(): void {
    Swal.fire({
      
      icon: 'question',
      title: this.translateService.instant('account.confirmDelete.title'),
      text: this.translateService.instant('account.confirmDelete.message'),
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('account.buttons.delete.title'),
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('generic.buttons.cancel'),
      cancelButtonColor: '#0d6efd'

    }).then(async (result) => {
      if(result.isConfirmed) {
        this.userService.deleteUser(this.user.name).subscribe();

        await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('account.deleted'));

        this.jwtTokenService.removeJwtToken();
        this.router.navigateByUrl('auth/login');
      }
    });
  }
}
