export class RegisterUser {

  name: string;
  email: string;
  userName: string;
  password: string;

  constructor(name: string,
              email: string,
              userName: string,
              password: string) {
    this.name = name;
    this.email = email;
    this.userName = userName;
    this.password = password;
  }
}
