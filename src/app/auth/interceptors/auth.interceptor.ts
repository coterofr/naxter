import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, concatMap, Observable, throwError } from 'rxjs';
import { JwtToken } from '../model/jwt-token';
import { AuthService } from '../services/auth.service';
import { JwtTokenService } from '../services/jwt-token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {

  private jwtToken: string | null;

  constructor(private jwtTokenService: JwtTokenService,
              private authService: AuthService) {
    this.jwtToken = this.jwtTokenService.getJwtToken();
  }

  intercept(request: HttpRequest<any>,
            next: HttpHandler): Observable<HttpEvent<any>> {
    if(!this.jwtTokenService.isLogged()) {
      return next.handle(request);
    }

    this.jwtToken = this.jwtTokenService.getJwtToken();
    if(this.jwtToken) {
      request = this.setBearerToken(request);
      return this.interceptNextHandle(request, next);
    }

    return next.handle(request);
  }

  private setBearerToken(request: HttpRequest<any>) {
    return request.clone({
      setHeaders: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
        Authorization: `Bearer ${this.jwtToken}`,
      }
    });
  }

  private interceptNextHandle(request: HttpRequest<any>,
                              next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError((error: HttpErrorResponse) => {

      if(error.status === 401) {
        this.jwtToken = this.jwtTokenService.getJwtToken();
        if(!this.jwtToken) {
          this.jwtTokenService.removeJwtToken();
          return throwError(error);
        }

        const jwt: JwtToken = new JwtToken(this.jwtToken);
        return this.authService.refresh(jwt).pipe(concatMap((jwtTokenRefresh: JwtToken) => {

          if(!jwtTokenRefresh) {
            return next.handle(request);
          }

          this.jwtTokenService.setJwtToken(jwtTokenRefresh.token);
          request = this.setBearerToken(request);

          return next.handle(request);
        }));
      } else if(error.status === 400 || error.status === 403 || error.status === 404) {
        return throwError(error);
      } else {
        this.jwtTokenService.removeJwtToken();

        return throwError(error);
      }
    }));
  }
}
