export class ChatMessage {

  id: string;
  emitter: string;
  receiver: string;
  message: string;

  constructor(id: string,
              emitter: string,
              receiver: string,
              message: string) {
    this.id = id;
    this.emitter = emitter;
    this.receiver = receiver;
    this.message = message;
  }
}
