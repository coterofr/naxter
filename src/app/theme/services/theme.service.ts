import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from 'src/app/shared/utils/url-api';
import { Theme } from '../model/theme';
import { UserTheme } from '../model/user-theme';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(private http: HttpClient) { }

  getTheme(id: string): Observable<Theme> {
    return this.http.get<Theme>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.THEMES, UrlApi.SLASH, id));
  }

  getThemes(): Observable<Theme[]> {
    return this.http.get<Theme[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.THEMES, UrlApi.SLASH, UrlApi.LIST));
  }

  searchThemes(user: string, query: string): Observable<Theme[]> {
    const params = new HttpParams().set('idUser', user).set('name', query);
    return this.http.get<Theme[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.THEMES, UrlApi.SLASH, UrlApi.USERS, UrlApi.SLASH, user, UrlApi.SLASH, UrlApi.SEARCH), { params: params });
  }

  createTheme(userTheme: UserTheme): Observable<Theme> {
    return this.http.post<Theme>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.THEMES, UrlApi.SLASH, UrlApi.CREATE), userTheme);
  }

  editTheme(id: string, userTheme: UserTheme): Observable<Theme> {
    return this.http.post<Theme>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.THEMES, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.EDIT), userTheme);
  }

  deleteTheme(id: string): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.THEMES, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.DELETE), id);
  }
}
