import { Theme } from '../../theme/model/theme';
import { User } from './user';

export class Subscription {

  id: string;
  time: Date | null;
  vip: boolean;
  subscriber: User | null;
  producer: User | null;
  theme: Theme | null;

  constructor(id: string,
              time: Date | null,
              vip: boolean,
              subscriber: User | null,
              producer: User | null,
              theme: Theme | null) {
    this.id = id;
    this.time = time;
    this.vip = vip;
    this.subscriber = subscriber;
    this.producer = producer;
    this.theme = theme;
  }
}
