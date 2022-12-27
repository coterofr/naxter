import { User } from "src/app/user/model/user";
import { Product } from './product';

export class Cart {

  id: string;
  buyer: User | null;
  products: Product[] | null;

  constructor(id: string,
              buyer: User | null,
              products: Product[] | null) {
    this.id = id;
    this.buyer = buyer;
    this.products = products;
  }
}
