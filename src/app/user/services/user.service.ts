import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from '../../shared/utils/url-api';
import { ConfigUser } from '../model/config-user';
import { User } from '../model/user';
import { UserPageable } from '../model/user-pageable';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(id: string): Observable<User> {
    return this.http.get<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.USERS, UrlApi.SLASH, id));
  }

  getUsers(): Observable<UserPageable> {
    return this.http.get<UserPageable>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.USERS));
  }

  getSubscribedAuthors(subscriber: string): Observable<User[]> {
    return this.http.get<User[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.USERS, UrlApi.SLASH, subscriber, UrlApi.SLASH, UrlApi.SUBSCRIPTIONS, UrlApi.SLASH, UrlApi.AUTHORS));
  }

  blockUser(id: string): Observable<User> {
    return this.http.post<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.USERS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.BLOCK), id);
  }

  editUser(id: string, config: ConfigUser): Observable<User> {
    return this.http.post<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.USERS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.EDIT), config);
  }

  deleteUser(id: string): Observable<{ name: string }> {
    return this.http.post<{ name: string }>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.USERS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.DELETE), id);
  }

  changeGenericRole(id: string): Observable<User> {
    return this.http.post<User>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.USERS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.CHANGE_GENERIC_ROLE), id);
  }
}
