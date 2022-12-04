import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from '../../shared/utils/url-api';
import { User } from '../../user/model/user';
import { JwtToken } from '../model/jwt-token';
import { LoginUser } from '../model/login-user';
import { RegisterUser } from '../model/register-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  register(registerUser: RegisterUser): Observable<User> {
    return this.http.post<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.AUTH, UrlApi.SLASH, UrlApi.REGISTER), registerUser);
  }

  login(loginUser: LoginUser): Observable<JwtToken> {
    return this.http.post<JwtToken>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.AUTH, UrlApi.SLASH, UrlApi.LOGIN), loginUser);
  }

  refresh(jwtToken: JwtToken): Observable<JwtToken> {
    return this.http.post<JwtToken>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.AUTH, UrlApi.SLASH, UrlApi.REFRESH), jwtToken);
  }

  refreshByName(name: string): Observable<JwtToken> {
    return this.http.post<JwtToken>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.AUTH, UrlApi.SLASH, UrlApi.REFRESH, UrlApi.SLASH, name), name);
  }
}
