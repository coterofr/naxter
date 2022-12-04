import { Item } from './item';

export class Merchandising {

  id: string;
  name: string;
  description: string;
  items: Item[];

  constructor(id: string,
              name: string,
              description: string,
              items: Item[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.items = items;
  }
}
