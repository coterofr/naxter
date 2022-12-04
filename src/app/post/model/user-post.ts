export class UserPost {

  id: string;
  name: string;
  description: string;
  user: string;
  theme: string;
  tags: string[] | null;

  constructor(id: string,
              name: string,
              description: string,
              user: string,
              theme: string,
              tags: string[] | null) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.user = user;
    this.theme = theme;
    this.tags = tags;
  }
}
