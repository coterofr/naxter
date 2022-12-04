export class Join {

  subscriber: string;
  producer: string;

  constructor(subscriber: string,
              producer: string) {
    this.subscriber = subscriber;
    this.producer = producer;
  }
}
