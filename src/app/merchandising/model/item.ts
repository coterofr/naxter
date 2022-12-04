export class Item {

  id: string;
  name: string;
  description: string;
  multimedia: string;

  constructor(id: string,
              name: string,
              description: string,
              multimedia: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.multimedia = multimedia;
  }
}
