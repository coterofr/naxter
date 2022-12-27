import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UrlApi } from 'src/app/shared/utils/url-api';
import { Product } from '../model/product';
import { Cart } from './../model/cart';
import { CartUser } from './../model/cart-user';
import { Merchandising } from './../model/merchandising';
import { ProductMerch } from './../model/product-merch';

@Injectable({
  providedIn: 'root'
})
export class MerchandisingService {

  constructor(private http: HttpClient) { }

  getMerchandisings(): Observable<Merchandising[]> {
    return this.http.get<Merchandising[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.LIST));
  }

  getProduct(id: string): Observable<Product> {
    return this.http.get<Product>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.PRODUCTS, UrlApi.SLASH, id));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.PRODUCTS));
  }

  searchProducts(merchandising: string[], name: string, user: string): Observable<Product[]> {
    const params = new HttpParams().set('merchandising', merchandising.toString()).set('name', name).set('user', user);
    return this.http.get<Product[]>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.PRODUCTS, UrlApi.SLASH, UrlApi.SEARCH), { params: params });
  }

  addProduct(productMerch: ProductMerch): Observable<Product> {
    return this.http.post<Product>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.PRODUCTS, UrlApi.SLASH, UrlApi.ADD), productMerch);
  }

  editProduct(id: string, productMerch: ProductMerch): Observable<Product> {
    return this.http.post<Product>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.PRODUCTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.EDIT), productMerch);
  }

  deleteProduct(id: string): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.PRODUCTS, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.DELETE), id);
  }

  getCart(id: string): Observable<Cart> {
    return this.http.get<Cart>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.CART, UrlApi.SLASH, id));
  }

  addProductCart(id: string, cartUser: CartUser): Observable<Cart> {
    return this.http.post<Cart>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.CART, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.ADD), cartUser);
  }

  removeProductCart(id: string, cartUser: CartUser): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(UrlApi.generateUrl(UrlApi.BASIC, UrlApi.MERCHANDASING, UrlApi.SLASH, UrlApi.CART, UrlApi.SLASH, id, UrlApi.SLASH, UrlApi.REMOVE), cartUser);
  }
}
