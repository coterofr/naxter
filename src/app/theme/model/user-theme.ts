export class UserTheme {

  name: string;
  description: string;
  user: string;

  constructor(name: string,
              description: string,
              user: string) {
    this.name = name;
    this.description = description;
    this.user = user;
  }
}
