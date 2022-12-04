import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConstApi } from '../../shared/utils/const-api';
import { RoleEnum } from '../enums/role-enum';
import { Role } from '../model/role';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private translateService: TranslateService) { }

  getRoles(): Map<string, string> {
    const roles: Map<string, string>  = new Map();
    Object.keys(RoleEnum).forEach(role => roles.set(Object(RoleEnum)[role], this.getRoleName(Object(RoleEnum)[role])));

    return roles;
  }

  private getWithoutPrefix(role: string): string {
    if(RoleEnum.CONSUMER === role) {
      return this.translateService.instant('admin.users.roles.consumer');
    } else if(RoleEnum.MODERATOR === role) {
      return this.translateService.instant('admin.users.roles.moderator');
    } else if(RoleEnum.PRODUCER === role) {
      return this.translateService.instant('admin.users.roles.producer');
    } else if(RoleEnum.ADMIN === role) {
      return this.translateService.instant('admin.users.roles.admin');
    } else {
      return this.translateService.instant('admin.users.roles.generic');
    }
  }

  private getWithPrefix(role: string): string {
    if((ConstApi.ROLE + RoleEnum.CONSUMER) === role) {
      return this.translateService.instant('admin.users.roles.consumer');
    } else if((ConstApi.ROLE + RoleEnum.MODERATOR) === role) {
      return this.translateService.instant('admin.users.roles.moderator');
    } else if((ConstApi.ROLE + RoleEnum.PRODUCER) === role) {
      return this.translateService.instant('admin.users.roles.producer');
    } else if((ConstApi.ROLE + RoleEnum.ADMIN) === role) {
      return this.translateService.instant('admin.users.roles.admin');
    } else {
      return this.translateService.instant('admin.users.roles.generic');
    }
  }

  getRoleName(role: string): string {
    if(role) {
      if(role.indexOf(ConstApi.ROLE) < 0) {
        return this.getWithoutPrefix(role);
      } else {
        return this.getWithPrefix(role);
      }
    } else {
      return "";
    }
  }

  isProducer(user: User):boolean {
    return user.roles.some((role: Role) => RoleEnum.PRODUCER === role.type || RoleEnum.MODERATOR === role.type || RoleEnum.ADMIN === role.type);
  }
}
