import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from 'src/app/shared/utils/url-api';
import { Post } from './../model/post';
import { UserPost } from './../model/user-post';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) { }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, id));
  }

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS));
  }

  getTopPosts(): Observable<Post[]> {
    return this.http.get<Post[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, UrlApi.HOME, UrlApi.SLASH, UrlApi.LIST));
  }

  getTopPostsByAuthor(author: string): Observable<Post[]> {
    return this.http.get<Post[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, UrlApi.USERS, UrlApi.SLASH, author, UrlApi.SLASH, UrlApi.TOP, UrlApi.SLASH, UrlApi.LIST));
  }

  searchPosts(theme: string, name: string, user: string): Observable<Post[]> {
    const params = new HttpParams().set('theme', theme).set('name', name).set('user', user);
    return this.http.get<Post[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, UrlApi.SEARCH), { params: params });
  }

  createPost(userPost: UserPost): Observable<Post> {
    return this.http.post<Post>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, UrlApi.CREATE), userPost);
  }

  editPost(id: string, userPost: UserPost): Observable<Post> {
    return this.http.post<Post>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.EDIT), userPost);
  }

  deletePost(id: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.DELETE), id);
  }

  ratePost(id: string, rating: number): Observable<Post> {
    return this.http.post<Post>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.RATE), rating);
  }
}
