import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Product } from 'src/app/models/product.model';
import { CartService } from 'src/app/services/cart.service';
import { StoreService } from 'src/app/services/store.service';

  const ROWS_HEIGHT: { [id:number]: number }= { 1: 400, 3: 333, 4: 350};

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  cols = 3;
  rowHeight = ROWS_HEIGHT[this.cols];
  category: string | undefined;
  products: Array<Product> | undefined;
  sort = 'desc';
  count = '12';
  productsSubscription: Subscription | undefined;

  constructor(private cartService: CartService, 
              private storeService: StoreService){}

  ngOnInit(): void{
    this.getProducts();
  }

  getProducts():void{
    this.productsSubscription = this.storeService.getAllProducts(this.count, this.sort, this.category)
    .subscribe((_products) => {
      this.products = _products;
    });
  }

  onColumnsCountChange(colsNum: number): void{
    this.cols = colsNum;
    this.rowHeight = ROWS_HEIGHT[this.cols];
 
  }

  onShowCategory(newCategory: string): void{
    this.category = newCategory;
    this.getProducts();
  }

  onAddToCart(product: Product): void{
    this.cartService.addToCart({
      product: product.image,
      name: product.title,
      price: product.price,
      quantity: 1,
      id: product.id
    });
  }

  onItemsCountChange(newCount:number):void{
    this.count = newCount.toString();
    this.getProducts();
  }

  onSortChange(newSort:string):void{
    this.sort = newSort;
    this.getProducts();
  }

  //コンポーネントが破棄される直前に呼び出されるメソッド
  //コンポーネントが不要になったときにリソースを解放するために使用されます。具体的には、サブスクリプションの解除やイベントリスナーの削除など、メモリリークを防ぐための後片付けを行います。
  //productsSubscription という名前の RxJS のサブスクリプションは storeService を使用して商品情報を取得する際に作成されます。コンポーネントが破棄されるとき（例えば、別のコンポーネントに移動したり、ページが閉じられたりするとき）、このサブスクリプションは不要になります。そのため、ngOnDestroy() 内で unsubscribe() メソッドを呼び出して、サブスクリプションを解除しています
  ngOnDestroy(): void {
    // if this.productsSubscription exists, unsubscribe
      if(this.productsSubscription){
        this.productsSubscription.unsubscribe();
      }
  }
}
