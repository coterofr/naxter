import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsumerGuard } from '../auth/guards/consumer.guard';
import { ChatComponent } from './components/chat/chat.component';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    canActivate: [ConsumerGuard]
  },
  {
    path: ':user1/:user2/messages',
    component: ChatComponent,
    canActivate: [ConsumerGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChatRoutingModule { }
