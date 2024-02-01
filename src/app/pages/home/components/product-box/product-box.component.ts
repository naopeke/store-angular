import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Product } from 'src/app/models/product.model';

@Component({
  selector: 'app-product-box',
  templateUrl: './product-box.component.html',
  styleUrls: ['./product-box.component.css']
})
export class ProductBoxComponent implements OnInit{


  //fullWidthMode が true の場合、コンポーネント内の要素を親要素の幅いっぱいに広げるようなスタイルやレイアウトを適用する場合に使用されることが一般的
  @Input() fullWidthMode = false;
  product: Product | undefined = {
    id: 1,
    title: 'Snickers',
    price: 150,
    category: 'shoes',
    description: 'Description',
    image: 'https://via.placeholder.com/150'
  };

  @Output() addToCart = new EventEmitter();

  constructor(){}



  ngOnInit(): void {
      
  }

  onAddToCart(): void {
    this.addToCart.emit(this.product);
  }
}
