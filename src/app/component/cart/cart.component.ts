import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
ans!:any;
  public products : any = [];
  public grandTotal !: number;
  constructor(private cartService : CartService,private http:HttpClient) { }

  ngOnInit(): void {
    this.cartService.cnt.subscribe(res=>{
      this.ans=res;
    })
    this.http.get<any>("http://localhost:3000/cart").subscribe(res=>{
      this.products=res;
    })
    this.products.map((a:any)=>{
      this.grandTotal += parseInt(a.total);
    })
    this.cartService.getProducts()
    .subscribe(res=>{
      //this.products = res;
      this.grandTotal = this.cartService.getTotalPrice();
    })
  }
  removeItem(item: any){
    this.http.delete<any>(`http://localhost:3000/cart/${item.id}`).subscribe(res=>{
      this.ngOnInit();
      this.cartService.cnt.next(this.ans-1);
    })
    this.cartService.removeCartItem(item);
  }
  emptycart(){
    this.http.delete<any>("http://localhost:3000/cart").subscribe(res=>{
      this.ngOnInit();
    })
    this.cartService.cnt.next(0);
    this.cartService.removeAllCart();
  }

}
