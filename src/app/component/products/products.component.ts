import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/api.service';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
ans!:any;
  public productList : any ;
  public filterCategory : any
  searchKey:string ="";
  constructor(private api : ApiService, private cartService : CartService,private http:HttpClient) { }

  ngOnInit(): void {
    this.cartService.cnt.subscribe(res=>{
      this.ans=res;
    })
    this.api.getProduct()
    .subscribe(res=>{
      this.productList = res;
      this.filterCategory = res;
      this.productList.forEach((a:any) => {
        if(a.category ==="women's clothing" || a.category ==="men's clothing"){
          a.category ="fashion"
        }
        Object.assign(a,{quantity:1,total:a.price});
      });
      console.log(this.productList)
    });

    this.cartService.search.subscribe((val:any)=>{
      this.searchKey = val;
    })
  }
  addtocart(item: any){
    let body={
      name:item.title,
      image:item.image,
      price:item.price,
      quantity:1,
      description:item.description,
      total:item.price
    }
 this.http.post<any>("http://localhost:3000/cart",body)
    .pipe(map((res:any)=>{
     console.log(res)
    })).subscribe(res=>{
      this.cartService.cnt.next(this.ans+1);
    })
    console.log(item,'cart item')
    this.cartService.addtoCart(item);
  }
  filter(category:string){
    this.filterCategory = this.productList
    .filter((a:any)=>{
      if(a.category == category || category==''){
        return a;
      }
    })
  }

}
