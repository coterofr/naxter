import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from 'src/app/shared/utils/url-api';
import { ChatMessage } from '../model/chat-message';
import { Chat } from './../model/chat';
import { Message } from './../model/message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient) { }

  getChat(idUser1: string, idUser2: string): Observable<Chat> {
    return this.http.get<Chat>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.CHAT, UrlApi.SLASH, idUser1, UrlApi.SLASH, idUser2, UrlApi.SLASH, UrlApi.CHAT));
  }

  getMessages(idUser1: string, idUser2: string): Observable<Message[]> {
    return this.http.get<Message[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.CHAT, UrlApi.SLASH, idUser1, UrlApi.SLASH, idUser2, UrlApi.SLASH, UrlApi.MESSAGES));
  }

  sendMessage(idUser1: string, idUser2: string, chatMessage: ChatMessage): Observable<Message> {
    return this.http.post<Message>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.CHAT, UrlApi.SLASH, idUser1, UrlApi.SLASH, idUser2, UrlApi.SLASH, UrlApi.SEND), chatMessage);
  }
}
