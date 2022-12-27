export class ProductMerch {

  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  user: string;
  merchandising: string;

  constructor(id: string,
              name: string,
              description: string,
              price: number,
              stock: number,
              user: string,
              merchandising: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.user = user;
    this.merchandising = merchandising;
  }
}
