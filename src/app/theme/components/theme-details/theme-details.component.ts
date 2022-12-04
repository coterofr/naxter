import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, throwError } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import Swal from 'sweetalert2';
import { Theme } from '../../model/theme';
import { UserTheme } from '../../model/user-theme';
import { ThemeService } from '../../services/theme.service';

declare var bootstrap: any;

@Component({
  selector: 'app-theme-details',
  templateUrl: './theme-details.component.html',
  styleUrls: ['./theme-details.component.scss']
})
export class ThemeDetailsComponent implements OnInit {

  private id!: string;
  private theme: Theme;
  private userTheme: UserTheme;
  private readonly ERROR_MESSAGE = 'exists';
  
  update: boolean = false;
  
  themeForm: FormGroup;

  constructor(private fb: FormBuilder,
              private themeService: ThemeService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private route: ActivatedRoute) {
    this.theme = new Theme('', '', null);
    this.userTheme = new UserTheme('', '', '');
    this.themeForm = this.fb.group({
      name: new FormControl(''),
      description: new FormControl('')
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
      this.theme = await firstValueFrom(this.themeService.getTheme(this.id));
      this.userTheme = new UserTheme(this.theme.name, this.theme.description, this.loggedUser);
    } else {
      this.update = false;
      this.userTheme = new UserTheme('', '', this.loggedUser);
    }

    this.themeForm = this.fb.group({
      name: new FormControl(this.userTheme.name, [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(25),
      ]),
      description: new FormControl(this.userTheme.description, [
        Validators.maxLength(500),
      ])
    });
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  get name(): FormControl {
    return this.themeForm.get('name') as FormControl;
  }

  get nameInvalid(): boolean | null {
    return this.name?.errors && (this.name?.touched || this.name?.dirty);
  }

  get description(): FormControl {
    return this.themeForm.get('description') as FormControl;
  }

  get descriptionInvalid(): boolean | null {
    return this.description?.errors && (this.description?.touched || this.description?.dirty);
  }

  checkFormErrors(): void {
    Object.values(this.themeForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  setFormErrors(): void {
    Object.values(this.themeForm.controls).forEach(control => control.setErrors({'invalid': true}));
  }

  showModalError(message: string): void {
    Swal.fire({
      icon: 'error',
      title: this.update ? this.translateService.instant("theme.errors.titleUpdated") : 
                           this.translateService.instant("theme.errors.titleCreated"),
      text: message,
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  async save(): Promise<void> {
    if(this.themeForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.userTheme.name = this.name?.value;
    this.userTheme.description = this.description?.value;
    this.userTheme.user = this.loggedUser;

    if(this.update) {
      this.edit();
    } else {
      this.create();
    }
  }

  private create(): void {
    this.themeService.createTheme(this.userTheme)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (theme: Theme) => {
        this.theme =  theme;
        this.update = true;

        await this.alertService.showAlert('alert-theme', 'alert-theme-text', true, this.translateService.instant('theme.created'));
      },
      error => {
        this.showModalError(error !== null && error.error !== null && error.error.indexOf(this.ERROR_MESSAGE) < 0 ?
                            this.translateService.instant('theme.errors.messageError') :
                            this.translateService.instant('theme.errors.messageExists'));
      }
    );
  }

  private edit(): void {
    this.themeService.editTheme(this.userTheme.name, this.userTheme)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (theme: Theme) => {
        this.theme =  theme;

        await this.alertService.showAlert('alert-theme', 'alert-theme-text', true, this.translateService.instant('theme.updated'));
      },
      error => {
        this.showModalError(error !== null && error.error !== null && error.error.indexOf(this.ERROR_MESSAGE) < 0 ?
                            this.translateService.instant('theme.errors.messageError') :
                            this.translateService.instant('theme.errors.messageExists'));
      }
    );
  }
}
