import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit ,inject} from '@angular/core';;
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [HttpClientModule,CommonModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css'
})
export class InvoiceComponent implements OnInit{
  httpclient = inject(HttpClient);
  router = inject(Router)
  invoiceData: any = [];
  totalPrice: number = 0;

  currentDate: Date;


  constructor(
  ) {
    this.currentDate = new Date();

  }

  ngOnInit(): void {
    this.fetchOrderDetails();
    this.router.resetConfig([{ path: '', redirectTo: 'invoice', pathMatch: 'full' }]);

  }

  // getCurrentDateTime(): any {
  //   const currentDate = new Date();
  //   return this.datePipe.transform(currentDate, 'yyyy-MM-dd HH:mm:ss');
  // }

  fetchOrderDetails() : void{
    
    this.httpclient.get<any[]>('http://localhost:3000/cart')
      .subscribe({
        next: (data) => {
          console.log(data);
          const allProducts = data.flatMap(cartItem => cartItem.products);
          console.log(allProducts);
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: "Invoice generated successfully",
            showConfirmButton: false,
            timer: 2000,
            iconColor: 'darkcyan'
          })

          this.invoiceData = allProducts.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalValue: item.quantity * item.product.price,
          }));
          this.updateProductTotalPrice()

         

        },
        error: (error) => {
          console.error('Error fetching cart data:', error);
        }
      });
  }

  updateProductTotalPrice(){
    this.totalPrice = this.invoiceData.reduce((total: Number, product: any) =>{
      return total + (product.totalValue || 0);
    }, 0)
  }

}
