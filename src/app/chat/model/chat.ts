import { User } from '../../user/model/user';
import { Message } from './message';

export class Chat {

  id: string;
  messages: Message[];
  user1: User | null;
  user2: User | null;

  constructor(id: string,
              messages: Message[],
              user1: User | null,
              user2: User | null) {
    this.id = id;
    this.messages = messages;
    this.user1 = user1;
    this.user2 = user2;
  }
}
