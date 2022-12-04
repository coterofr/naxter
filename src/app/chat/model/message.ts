import { User } from "src/app/user/model/user";

export class Message {

  id: string;
  emitter: User | null;
  receiver: User | null;
  message: string;
  date: Date | null;

  constructor(id: string,
              emitter: User | null,
              receiver: User | null,
              message: string,
              date: Date | null) {
    this.id = id;
    this.emitter = emitter;
    this.receiver = receiver;
    this.message = message;
    this.date = date;
  }
}
