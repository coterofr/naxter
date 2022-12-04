import { Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { ConstApi } from '../../shared/utils/const-api';
import { RoleEnum } from '../../user/enums/role-enum';
import { PayloadToken } from '../model/payload-token';

@Injectable({
  providedIn: 'root'
})
export class JwtTokenService {

  constructor(private localStorageService: LocalStorageService) { }

  setJwtToken(jwtToken: string): void {
    this.localStorageService.remove(ConstApi.JWT_TOKEN);
    this.localStorageService.set(ConstApi.JWT_TOKEN, jwtToken);
  }

  getJwtToken(): string | null {
    return this.localStorageService.get(ConstApi.JWT_TOKEN);
  }

  removeJwtToken(): void {
    this.localStorageService.remove(ConstApi.JWT_TOKEN);
  }

  isLogged(): boolean {
    return this.getJwtToken() ? true : false;
  }

  private hasRole(roleEnum: RoleEnum): boolean {
    if(!this.isLogged()) {
      return false;
    } else {
      const jwtToken: string | null = this.getJwtToken();

      if(!jwtToken) {
        return false;
      } else {
        const roles: string[] = this.getRoles(jwtToken);

        if(roles === null || roles.length === 0 || roles.indexOf(ConstApi.ROLE + roleEnum) < 0) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  isConsumer(): boolean {
    return this.hasRole(RoleEnum.CONSUMER) || this.hasRole(RoleEnum.PRODUCER) ||
           this.hasRole(RoleEnum.MODERATOR) || this.hasRole(RoleEnum.ADMIN);
  }

  isProducer(): boolean {
    return this.hasRole(RoleEnum.PRODUCER) || this.hasRole(RoleEnum.MODERATOR) || this.hasRole(RoleEnum.ADMIN);
  }

  isModerator(): boolean {
    return this.hasRole(RoleEnum.MODERATOR) || this.hasRole(RoleEnum.ADMIN);
  }

  isAdmin(): boolean {
    return this.hasRole(RoleEnum.ADMIN);
  }

  private getPayload(jwtToken: string): PayloadToken {
    const payload: string = jwtToken.split('.')[1];
    const payloadDecode: string = atob(payload);
    const payloadContent: PayloadToken = JSON.parse(payloadDecode);

    return payloadContent;
  }

  private getRoles(jwtToken: string): string[] {
    return this.getPayload(jwtToken).roles;
  }

  getRole(): string | null {
    if(!this.isLogged()) {
      return null;
    } else {
      const jwtToken: string | null = this.getJwtToken();

      if(!jwtToken) {
        return null;
      } else {
        return this.getPayload(jwtToken).roles[0];
      }
    }
  }

  getName(): string | null {
    if(!this.isLogged()) {
      return null;
    } else {
      const jwtToken: string | null = this.getJwtToken();

      if(!jwtToken) {
        return null;
      } else {
        return this.getPayload(jwtToken).sub;
      }
    }
  }
}
