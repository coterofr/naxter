import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from 'src/app/shared/utils/url-api';
import { Comment } from './../model/comment';
import { PostComment } from './../model/post-comment';

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private http: HttpClient) { }

  getComment(idPost: string, id: string): Observable<Comment> {
    return this.http.get<Comment>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, idPost, UrlApi.SLASH, UrlApi.COMMENTS, UrlApi.SLASH, id));
  }

  getComments(idPost: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, idPost, UrlApi.SLASH, UrlApi.COMMENTS, UrlApi.SLASH, UrlApi.LIST));
  }

  addComment(idPost: string, postComment: PostComment): Observable<Comment> {
    return this.http.post<Comment>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, idPost, UrlApi.SLASH, UrlApi.COMMENTS, UrlApi.SLASH, UrlApi.ADD), postComment);
  }

  editComment(idPost: string, id: string, postComment: PostComment): Observable<Comment> {
    return this.http.post<Comment>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, idPost, UrlApi.SLASH, UrlApi.COMMENTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.EDIT), postComment);
  }

  deleteComment(idPost: string, id: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, idPost, UrlApi.SLASH, UrlApi.COMMENTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.DELETE), id);
  }
}
