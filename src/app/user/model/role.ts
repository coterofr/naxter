import { RoleEnum } from '../enums/role-enum';

export class Role {

  type: RoleEnum;
  description: string;

  constructor(type: RoleEnum,
              description: string) {
    this.type = type;
    this.description = description;
  }
}
