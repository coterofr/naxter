import { RoleEnum } from '../enums/role-enum';

export class ConfigUser {

  name: string;
  role: RoleEnum;
  email: string;
  userName: string;

  constructor(name: string,
              role: RoleEnum,
              email: string,
              userName: string) {
    this.name = name;
    this.role = role;
    this.email = email;
    this.userName = userName;
  }
}
