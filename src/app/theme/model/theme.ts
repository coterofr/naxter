import { User } from '../../user/model/user';

export class Theme {

  name: string;
  description: string;
  user: User | null;

  constructor(name: string,
              description: string,
              user: User | null) {
    this.name = name;
    this.description = description;
    this.user = user;
  }
}
