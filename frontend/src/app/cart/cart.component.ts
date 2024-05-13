import { Component, OnInit ,inject,EventEmitter, Output, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';



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
  imports: [CommonModule,HttpClientModule,FormsModule,FooterComponent,HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  httpclient = inject(HttpClient);
  cartTotal: number = 0;
  productsData: any = [];
  productQuantities: { [productId: string]: number } = {};
  totalPrice: number = 0;
  quantityUpdated?: boolean;
  cartItems: any[] = [];
  cartCount!: number;
  userId : any;


  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,

    private router: Router,
    private cartService : CartService

  ) { 


  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.userId = localStorage.getItem('user._id');
   }

   this.fetchData();
    this.cartCount = this.cartService.getCartCount();

    this.cartService.cartCount$.subscribe(count => {
      this.cartCount = count;
    });

  }



  fetchData(): void {
    const userId = this.userId;
    console.log(userId);
    

    this.httpclient.get<any[]>(`http://localhost:3000/cart/${userId}`)
      .subscribe({
        next: (data) => {
          console.log(data);
          const allProducts = data.flatMap(cartItem => cartItem.products);
          console.log(allProducts);

          this.productsData = allProducts.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalValue: item.quantity * item.product.price,
          }));
          this.updateProductTotalPrice();
          this.cartService.fetchDataAndUpdateCount(); 

          
        },
        error: (error) => {
          console.error('Error fetching cart data:', error);
        }
      });
}


  removeFromCart(productId: any): void {
    if (!productId) {
      console.error('Product ID is undefined');
      return;
    }
    this.httpclient.delete('http://localhost:3000/cart/delete/' + productId)
      .subscribe({
        next: () => {
          const currentCount = this.cartService.getCartCount();

          const newCount = (currentCount - this.productsData.quantity)|0;

          this.productsData = this.productsData.filter((item:any) => item.product._id !== productId);
          this.cartService.updateCartCount(newCount);
        },
        error: (error) => {
          console.error('Error removing product from cart:', error);
        }
      });
  }
  
  

  increaseQuantity(productId: string, quantity: number): void {
    const updatedQuantity = quantity + 1;
    this.updateQuantityOnBackend(productId, updatedQuantity);
    this.cartService.fetchDataAndUpdateCount(); 

}

  decreaseQuantity(productId: string, quantity: number): void {
    if (quantity > 1) {
        const updatedQuantity = quantity - 1;
        this.updateQuantityOnBackend(productId, updatedQuantity);
        this.cartService.updateCartCount(updatedQuantity);

    }
}


updateQuantityOnBackend(productId: string, quantity: number): void {
  this.httpclient.put<any>(`http://localhost:3000/cart/update/${productId}`, { quantity })
      
      .subscribe({
        next: (response) => {
          
        console.log('Quantity updated successfully:', response);  
          this.fetchData();
        },
        error: (error) => {
              console.error('Error updating quantity:', error);
    }
      });
}
  
  

  updateProductTotalPrice(): void {
    this.cartTotal = this.productsData.reduce((total: number, product: any) => {
      return total + (product.totalValue || 0); 
    }, 0);
    console.log('Total cart price:', this.cartTotal);
  }

 
  goToCheckout(): void {
    this.router.navigate(['/check-out'])
  }

 
  
 


  


  
  
  
  
  
  
  
}
