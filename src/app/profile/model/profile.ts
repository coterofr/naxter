export class Profile {

  name: string;
  description: string;
  dateBirth: Date;
  visits: number;

  constructor(name: string,
              description: string,
              dateBirth: Date,
              visits: number) {
    this.name = name;
    this.description = description;
    this.dateBirth = dateBirth;
    this.visits = visits;
  }
}
