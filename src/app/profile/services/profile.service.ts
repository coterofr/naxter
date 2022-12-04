import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from '../../shared/utils/url-api';
import { User } from '../../user/model/user';
import { Account } from '../model/account';
import { Visualization } from '../model/visualization';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http: HttpClient) { }

  getProfile(id: string): Observable<User> {
    return this.http.get<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.PROFILES, UrlApi.SLASH, id));
  }

  getProfiles(): Observable<User[]> {
    return this.http.get<User[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.PROFILES));
  }

  searchProfiles(query: string): Observable<User[]> {
    const params = new HttpParams().set('name', query);
    return this.http.get<User[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.PROFILES, UrlApi.SLASH, UrlApi.SEARCH), {params: params});
  }

  getAccount(id: string): Observable<User> {
    return this.http.get<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.PROFILES, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.ACCOUNT));
  }

  editAccount(id: string, account: Account): Observable<User> {
    return this.http.post<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.PROFILES, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.ACCOUNT, UrlApi.SLASH, UrlApi.EDIT), account);
  }

  visit(id: string, visualization: Visualization): Observable<User> {
    return this.http.post<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.PROFILES, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.VISIT), visualization);
  }
}
