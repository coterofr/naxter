import { User } from 'src/app/user/model/user';

export class Merchandising {

  name: string;
  description: string;
  user: User;
  date: Date;

  constructor(name: string,
              description: string,
              user: User,
              date: Date) {
    this.name = name;
    this.description = description;
    this.user = user;
    this.date = date;
  }
}
