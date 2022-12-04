import { Merchandising } from '../../merchandising/model/merchandising';
import { Profile } from '../../profile/model/profile';
import { Theme } from '../../theme/model/theme';
import { Role } from './role';

export class User {

  email: string;
  name: string;
  userName: string;
  password: string;
  block: boolean;
  rating: number;
  roles: Role[];
  profile: Profile | null;
  themes: Theme[] | null;
  merchandising: Merchandising | null;

  constructor(email: string,
              name: string,
              userName: string,
              password: string,
              block: boolean,
              rating: number,
              roles: Role[],
              profile: Profile | null,
              themes: Theme[] | null,
              merchandising: Merchandising | null) {
    this.email = email;
    this.name = name;
    this.userName = userName;
    this.password = password;
    this.block = block;
    this.rating = rating;
    this.roles = roles;
    this.profile = profile;
    this.themes = themes;
    this.merchandising = merchandising;
  }
}
