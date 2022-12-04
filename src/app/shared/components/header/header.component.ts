import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { JwtTokenService } from '../../../auth/services/jwt-token.service';
import { RoleService } from '../../../user/services/role.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  language: string;

  constructor(private roleService: RoleService,
              private jwtTokenService: JwtTokenService,
              private translateService: TranslateService,
              private router: Router) {
    this.language = 'es';
  }

  ngOnInit(): void { }

  get isLogged(): boolean {
    return this.jwtTokenService.isLogged();
  }

  get loggedUser(): string | null {
    return this.jwtTokenService.getName();
  }

  get isModerator(): boolean {
    return this.jwtTokenService.isModerator();
  }

  get role(): string | null {
    const role: string = this.jwtTokenService.getRole() as string;

    return this.roleService.getRoleName(role);
  }

  onChangeLanguage(value: string): void {
    this.translateService.use(value);
  }

  logout(): void {
    this.jwtTokenService.removeJwtToken();
    this.router.navigateByUrl('auth/login');
  }
}
