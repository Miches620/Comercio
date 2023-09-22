import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../entidades/stock';

@Injectable({
  providedIn: 'root'
})
export class StockService {
  url:string="http://localhost:3000/";
  constructor(private http:HttpClient) { }

  obtenerStock():Observable<any>{
    return this.http.get(this.url+'stock')
  }

  agregarStock(stock:Stock):Observable<any>{
    return this.http.post(this.url+'stock',stock);
  }

  modificarStock(id:number,stock:Stock):Observable<any>{
    return this.http.put(this.url+'stock/'+id,stock)
  }

  borrarStock(id:number):Observable<any>{
    return this.http.delete(this.url+'stock/'+id);
  }
}
