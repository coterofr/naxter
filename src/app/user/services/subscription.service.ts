import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Join } from '../../profile/model/join';
import { UrlApi } from '../../shared/utils/url-api';
import { Subscription } from '../model/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  getSubscription(subscriber: string, producer: string): Observable<Subscription> {
    return this.http.get<Subscription>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.SUBSCRIPTIONS, UrlApi.SLASH, UrlApi.SUBSCRIBER, UrlApi.SLASH, subscriber, UrlApi.SLASH, UrlApi.PRODUCER, UrlApi.SLASH, producer));
  }

  getSubscriptionsBySubscriber(subscriber: string): Observable<Subscription[]> {
    return this.http.get<Subscription[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.SUBSCRIPTIONS, UrlApi.SLASH, UrlApi.SUBSCRIBER, UrlApi.SLASH, subscriber));
  }

  subscribe(subscriber: string, join: Join): Observable<Subscription> {
    return this.http.post<Subscription>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.SUBSCRIPTIONS, UrlApi.SLASH, subscriber, UrlApi.SLASH, UrlApi.SUBSCRIBE), join);
  }

  unsubscribe(subscriber: string, join: Join): Observable<string> {
    return this.http.post<string>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.SUBSCRIPTIONS, UrlApi.SLASH, subscriber, UrlApi.SLASH, UrlApi.UNSUBSCRIBE), join);
  }
}
