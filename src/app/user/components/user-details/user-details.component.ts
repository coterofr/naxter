import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { JwtToken } from '../../../auth/model/jwt-token';
import { AuthService } from '../../../auth/services/auth.service';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';
import { AlertService } from '../../../shared/services/alert.service';
import { ConstApi } from '../../../shared/utils/const-api';
import { RoleEnum } from '../../enums/role-enum';
import { ConfigUser } from '../../model/config-user';
import { User } from '../../model/user';
import { RoleService } from '../../services/role.service';
import { UserService } from '../../services/user.service';

declare var bootstrap: any;

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {

  private id!: string;
  private configUser: ConfigUser;
  
  user: User;
  configForm: FormGroup;

  private readonly ERROR_MESSAGE = 'exists';

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private roleService: RoleService,
              private authService: AuthService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private route: ActivatedRoute,
              private router: Router) {
    this.user = new User('', '', '', '', false, 0, [], null, null, null);
    this.configUser = new ConfigUser('', RoleEnum.GENERIC, '', '');
    this.configForm = this.fb.group({
      name: new FormControl(''),
      role: new FormControl(''),
      email: new FormControl(''),
      userName: new FormControl(''),
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
    const paramMap: ParamMap = await firstValueFrom(this.route.paramMap);
    this.id = paramMap.get('id') as string;
    this.user = await firstValueFrom(this.userService.getUser(this.id));
    this.configUser = new ConfigUser(this.user.name, this.user.roles[0].type, this.user.email, this.user.userName);

    this.configForm = this.fb.group({
      name: new FormControl(this.configUser.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]),
      role: new FormControl(this.configUser.role, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]),
      email: new FormControl(this.configUser.email, [
        Validators.required,
        Validators.pattern(ConstApi.EMAIL_FORMAT),
        Validators.minLength(10),
        Validators.maxLength(50),
      ]),
      userName: new FormControl(this.configUser.userName, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(50),
      ]),
    });
  }

  get name(): FormControl {
    return this.configForm.get('name') as FormControl;
  }

  get nameInvalid(): boolean | null {
    return this.name?.errors && (this.name?.touched || this.name?.dirty);
  }

  get role(): FormControl {
    return this.configForm.get('role') as FormControl;
  }

  get roleInvalid(): boolean | null {
    return this.role?.errors && (this.role?.touched || this.role?.dirty);
  }

  get email(): FormControl {
    return this.configForm.get('email') as FormControl;
  }

  get emailInvalid(): boolean | null {
    return this.email?.errors && (this.email?.touched || this.email?.dirty);
  }

  get userName(): FormControl {
    return this.configForm.get('userName') as FormControl;
  }

  get userNameInvalid(): boolean | null {
    return this.userName?.errors && (this.userName?.touched || this.userName?.dirty);
  }

  get roles(): Map<string, string> {
    return this.roleService.getRoles();
  }

  get userLogged(): string | null {
    return this.jwtTokenService.getName();
  }

  get isModerator(): boolean {
    return this.jwtTokenService.isModerator();
  }

  checkFormErrors(): void {
    Object.values(this.configForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.configForm.controls).forEach(control => control.setErrors({'invalid': true}));
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

  block(name: string): void {
    this.userService.blockUser(name).subscribe(async(userBlock: User) => {
      this.user.block = userBlock.block

      const alert = userBlock.block ? 'admin.user.blocked' : 'admin.user.unblocked';
      await this.alertService.showAlert('alert-block', 'alert-block-text', true, this.translateService.instant(alert));
    });
  }

  private refreshJwtToken(): void {
    this.authService.refreshByName(this.user.name).subscribe((jwtTokenRefresh: JwtToken) => {
      if(jwtTokenRefresh) {
        this.jwtTokenService.setJwtToken(jwtTokenRefresh.token);
      }
    });
  }

  async config(): Promise<void> {
    if(this.configForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.configUser.name = this.name?.value;
    this.configUser.role = this.role?.value;
    this.configUser.email = this.email?.value;
    this.configUser.userName = this.userName?.value;

    this.userService.editUser(this.id, this.configUser)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (user: User) => {
        this.id = user.name;
        if(this.user.name === this.userLogged &&
          (this.user.name !== user.name || this.user.roles[0].type !== user.roles[0].type)) {
          this.user = user;
          this.refreshJwtToken();
        } else {
          this.user = user;
        }

        await this.alertService.showAlert('alert-config', 'alert-config-text', true, this.translateService.instant('admin.user.configurated'));
      },
      error => {
        this.showModalError(error !== null && error.error !== null && error.error.indexOf(this.ERROR_MESSAGE) < 0 ?
                            this.translateService.instant('admin.user.errors.messageError') :
                            this.translateService.instant('admin.user.errors.messageExists'));
      }
    );
  }

  delete(name: string): void {
    Swal.fire({
      icon: 'question',
      title: this.translateService.instant('admin.user.confirmDelete.title'),
      text: this.translateService.instant('admin.user.confirmDelete.message', {user: name}),
      showCloseButton: true,
      showConfirmButton: true,
      confirmButtonText: this.translateService.instant('admin.user.buttons.delete.title'),
      confirmButtonColor: '#dc3545',
      showCancelButton: true,
      cancelButtonText: this.translateService.instant('generic.buttons.cancel'),
      cancelButtonColor: '#0d6efd'
    }).then(async (result) => {
      if(result.isConfirmed) {
        this.userService.deleteUser(name).subscribe();

        await this.alertService.showAlert('alert-delete', 'alert-delete-text', true, this.translateService.instant('admin.user.deleted'));

        this.router.navigateByUrl('/users/list');
      }
    });
  }
}
