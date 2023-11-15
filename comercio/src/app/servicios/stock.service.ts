import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Historial } from "../entidades/historial";
import { Historial as HistorialInterface} from "../entidades/interfaces/historial";
import { Stock } from "../entidades/stock";
import { Stock as StockInterface} from "../entidades/interfaces/stock";

@Injectable({
  providedIn: "root"
})
export class StockService {
  url:string="http://localhost:3000/";
  constructor(private http:HttpClient) { }

  /*HISTORIAL*/

  obtenerHistorial():Observable<HistorialInterface[]>{
    return this.http.get<HistorialInterface[]>(this.url+"historial");
  }

  agregarHistorial(historial:Historial):Observable<HistorialInterface[]>{
    return this.http.post<HistorialInterface[]>(this.url+"historial",historial);
  }

  modificarHistorial(id:number,historial:Historial):Observable<HistorialInterface[]>{
    return this.http.put<HistorialInterface[]>(this.url+"historial/"+id,historial);
  }

  borrarHistorial(id:number):Observable<void>{
    return this.http.delete<void>(this.url+"historial/"+id);
  }

  /*STOCK*/

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
