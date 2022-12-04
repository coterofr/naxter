import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable({
  providedIn: 'root'
})
export class ConsumerGuard implements CanActivate {
  
  constructor(private tokenService: JwtTokenService,
              private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean | UrlTree> |
                                           Promise<boolean | UrlTree> |
                                           boolean |
                                           UrlTree {
    if(!this.tokenService.isConsumer()) {
      this.router.navigate(['/']);

      return false;
    } else {
      return true;
    }
  }
}