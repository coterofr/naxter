import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, firstValueFrom, Observable, share, startWith, Subject, switchMap, throwError } from 'rxjs';
import { JwtTokenService } from 'src/app/auth/services/jwt-token.service';
import { AlertService } from 'src/app/shared/services/alert.service';
import Swal from 'sweetalert2';
import { Message } from '../../model/message';
import { ChatService } from '../../services/chat.service';
import { Chat } from './../../model/chat';
import { ChatMessage } from './../../model/chat-message';

declare var bootstrap: any;

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  private displayMessages: Subject<string> = new Subject();
  private chatMessage: ChatMessage;
  private user1: string = '';
  private chatMessages: any;
  
  chat: Chat;
  user2: string = '';
  
  messageForm: FormGroup;
  messages$: Observable<Message[]> = new Observable<Message[]>();

  constructor(private fb: FormBuilder,
              private chatService: ChatService,
              private jwtTokenService: JwtTokenService,
              private alertService: AlertService,
              private translateService: TranslateService,
              private route: ActivatedRoute) {
    this.chat = new Chat('', [], null, null);
    this.chatMessage = new ChatMessage('', '', '', '');
    this.messageForm = this.fb.group({
      message: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.enableTooltips();
    this.initData();
  }

  private enableTooltips(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
  }

  private async initData(): Promise<void> {
    const paramMap: ParamMap = await firstValueFrom(this.route.paramMap);
    this.user1 = paramMap.get('user1') as string;
    this.user2 = paramMap.get('user2') as string;

    this.getChat();

    this.chatMessages = document.getElementById('chat-messages');

    this.messageForm = this.fb.group({
      message: new FormControl('', [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(250),
      ])
    });

    this.getMessages();
    this.getMessagesPeriodically();
    this.scrollLastMessage();
  }

  private async getChat() {
    this.chat = await firstValueFrom(this.chatService.getChat(this.user1, this.user2));
  }

  private getMessages(): void {
    this.messages$ = this.displayMessages.pipe(startWith(''),
                                               switchMap((query: any) => this.chatService.getMessages(this.user1, this.user2)),
                                               share());
  }

  private scrollLastMessage() {
    setTimeout(()=> this.chatMessages.scrollTop = this.chatMessages.scrollHeight, 1000);
  }

  private reloadMessages() {
    this.displayMessages.next(this.user1);
  }

  private getMessagesPeriodically(): void {
    const interval = setInterval(async() => {
      if(this.chat.messages) {
        const numMessagesBefore = this.chat.messages.length;
        await this.getChat();
        const numMessagesAfter = this.chat.messages.length;
        this.reloadMessages();

        if(numMessagesBefore < numMessagesAfter) {
          this.scrollLastMessage();
        }
      }
    }, 100000);
  }

  get message(): FormControl {
    return this.messageForm.get('message') as FormControl;
  }

  get messageInvalid(): boolean | null {
    return this.message?.errors && (this.message?.touched || this.message?.dirty);
  }

  get loggedUser(): string {
    return this.jwtTokenService.getName() as string;
  }

  private checkFormErrors(): void {
    Object.values(this.messageForm.controls).forEach(control => control.invalid ? control.markAsDirty() : control);
  }

  private setFormErrors(): void {
    Object.values(this.messageForm.controls).forEach(control => control.setErrors({'invalid': true}));
  }

  private showModalError(): void {
    Swal.fire({
      icon: 'error',
      title: this.translateService.instant("chat.errors.title"),
      text: this.translateService.instant("chat.errors.message"),
      showCloseButton: true,
      showConfirmButton: false,
      timer: 2500
    });
  }

  async send(): Promise<void> {
    if(this.messageForm.invalid) {
      this.checkFormErrors();

      return;
    }

    this.chatMessage.id = this.chat.id;
    this.chatMessage.emitter = this.loggedUser;
    this.chatMessage.receiver = this.user2;
    this.chatMessage.message = this.message?.value;

    this.chatService.sendMessage(this.loggedUser, this.user2, this.chatMessage)
      .pipe(catchError(error => throwError(error)))
      .subscribe(async (message: Message) => {
        this.message?.setValue('');
        this.chat = await firstValueFrom(this.chatService.getChat(this.user1, this.user2));

        this.reloadMessages();
        this.scrollLastMessage();

        await this.alertService.showAlert('alert-message', 'alert-message-text', true, this.translateService.instant('chat.message.sended'));
      },
      error => this.showModalError()
    );
  }
}
