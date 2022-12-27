import { User } from 'src/app/user/model/user';
import { Merchandising } from './merchandising';

export class Product {

  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  multimedia: string;
  merchandising: Merchandising | null;
  user: User | null;
  date: Date;

  constructor(id: string,
              name: string,
              description: string,
              price: number,
              stock: number,
              multimedia: string,
              merchandising: Merchandising | null,
              user: User | null,
              date: Date) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.multimedia = multimedia;
    this.merchandising = merchandising;
    this.user = user;
    this.date = date;
  }
}
