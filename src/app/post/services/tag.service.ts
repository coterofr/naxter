import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from 'src/app/shared/utils/url-api';
import { Tag } from './../model/tag';
import { TagPageable } from './../model/tag-pageable';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  getTags(id: string): Observable<TagPageable> {
    const params = new HttpParams().set('id', id);
    return this.http.get<TagPageable>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.TAGS, UrlApi.SLASH, UrlApi.LIST), { params: params });
  }

  addTag(id: string, tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.TAGS, UrlApi.SLASH, UrlApi.ADD), tag);
  }

  deleteTag(idPost: string, idTag: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.POSTS, UrlApi.SLASH, idPost, UrlApi.SLASH, UrlApi.TAGS, UrlApi.SLASH, idTag, UrlApi.SLASH, UrlApi.DELETE), idTag);
  }
}
