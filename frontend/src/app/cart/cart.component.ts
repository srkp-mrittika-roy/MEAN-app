import { Component, OnInit ,inject} from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { Router } from '@angular/router';



interface CartData {
  _id: string;
  productName: string;
  productType: string;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,HttpClientModule,HeaderComponent,FooterComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  httpclient = inject(HttpClient);
  cartTotal: number = 0;
  productsData: any = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router

  ) { }

  ngOnInit(): void {
    
    this.fetchData();

  }

  fetchData(): void {
    this.httpclient.get<any[]>('http://localhost:3000/cart')
      .subscribe((data) => {
          console.log(data);
          this.productsData = data.flatMap(cartItem => cartItem.products);
          // this.calculateTotal();
        },
        
      );
  }

  removeFromcart(productId:string) {
    this.httpclient.delete<any>('http://localhost:3000/cart/delete'+productId)
      .subscribe((response)=> {
        console.log(response);
        this.fetchData();
        
      })
  }


  // calculateTotal(): void {
  //   this.cartTotal = this.productsData.products.reduce((total: number, product: any) => {
  //     return total + product.price;
  //   }, 0);
  // }
  
  
  
  
  
  
}
