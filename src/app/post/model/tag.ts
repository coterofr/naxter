export class Tag {

  id: string | null;
  name: string;
  description: string;

  constructor(name: string,
              description: string) {
    this.id = null;
    this.name = name;
    this.description = description;
  }
}
