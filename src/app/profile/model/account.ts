export class Account {

  name: string;
  email: string;
  userName: string;
  description: string | null;
  dateBirth: Date | null;
  visits: number;
  rating: number;

  constructor(name: string,
              email: string,
              userName: string,
              description: string | null,
              dateBirth: Date | null,
              visits: number,
              rating: number) {
    this.name = name;
    this.email = email;
    this.userName = userName;
    this.description = description;
    this.dateBirth = dateBirth;
    this.visits = visits;
    this.rating = rating;
  }
}
