import { Theme } from "src/app/theme/model/theme";
import { User } from "src/app/user/model/user";
import { Tag } from "./tag";

export class Post {

  id: string;
  name: string;
  description: string;
  theme: Theme | null;
  user: User | null;
  date: Date;
  subscriber: boolean;
  multimedia: string;
  tags: Tag[] | null;
  rating: number;

  constructor(id: string,
              name: string,
              description: string,
              theme: Theme | null,
              user: User | null,
              date: Date,
              subscriber: boolean,
              multimedia: string,
              tags: Tag[] | null,
              rating: number) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.theme = theme;
    this.user = user;
    this.date = date;
    this.subscriber = subscriber;
    this.multimedia = multimedia;
    this.tags = tags;
    this.rating = rating;
  }
}
