import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cart = new BehaviorSubject<Cart>({ items: []});

// MatSnackBarはtoast
  constructor(private _snackBar: MatSnackBar) { }

  addToCart(item: CartItem): void{
    const items = [...this.cart.value.items];

    const itemInCart = items.find((_item) => _item.id === item.id);

    if(itemInCart){
      itemInCart.quantity += 1;
    } else {
      items.push(item);
    }

    this.cart.next({ items });
    this._snackBar.open('1 item added to cart.', 'Ok', { duration: 3000 });
    console.log(this.cart.value);
  }

  removeQuantity(item: CartItem): void{
    let itemForRemoval: CartItem | undefined;
    this.cart.value.items.map((_item) => {
      if(_item.id === item.id){
        _item.quantity --;

        if (_item.quantity === 0){
          itemForRemoval = _item;
        }
      }
      return _item;
    });
  }

  // header.componentとcart.componentで使うのでserviceにいれる
  getTotal(items: Array<CartItem>):number{
    return items
    //mapメソッドを使用して、各アイテムの価格と数量を掛け合わせた新しい配列を作成します。
    .map((item)=> item.price * item.quantity)
    //reduceメソッドを使用して、新しい配列内のすべての要素を合計します。初期値は0です。
    .reduce((prev, current) => prev + current, 0)
  }

  clearCart(): void{
    this.cart.next({ items: []});
    this._snackBar.open('Cart is cleared.', 'Ok', { duration: 3000});
  }

  removeFromCart(item: CartItem): void{
    const filteredItems = this.cart.value.items.filter(
      (_item) => _item.id !== item.id
    );
    this.cart.next({ items: filteredItems });
    this._snackBar.open('1 item removed from cart.', 'Ok', { duration: 3000});
  }
}
