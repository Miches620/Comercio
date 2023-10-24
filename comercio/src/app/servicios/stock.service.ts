import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Stock } from "../entidades/stock";
import { Stock as StockInterface} from "../entidades/interfaces/stock";

@Injectable({
  providedIn: "root"
})
export class StockService {
  url:string="http://localhost:3000/";
  constructor(private http:HttpClient) { }

  obtenerStock():Observable<StockInterface[]>{
    return this.http.get<StockInterface[]>(this.url+"stock");
  }

  agregarStock(stock:Stock):Observable<StockInterface[]>{
    return this.http.post<StockInterface[]>(this.url+"stock",stock);
  }

  modificarStock(id:number,stock:Stock):Observable<StockInterface[]>{
    return this.http.put<StockInterface[]>(this.url+"stock/"+id,stock);
  }

  borrarStock(id:number):Observable<void>{
    return this.http.delete<void>(this.url+"stock/"+id);
  }
}
