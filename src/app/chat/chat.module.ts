import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './components/chat/chat.component';
import { MessageComponent } from './components/message/message.component';

@NgModule({
  declarations: [
    ChatComponent,
    MessageComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class ChatModule { }
