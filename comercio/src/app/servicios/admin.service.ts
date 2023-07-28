import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  obtenerDatosMarcas():Observable<any>{
    return this.http.get('./assets/data/marcas.json');
  }
  obtenerDatosProductos():Observable<any>{
    return this.http.get('./assets/data/productos.json');
  }
  obtenerDatosProveedores():Observable<any>{
    return this.http.get('./assets/data/proveedores.json');
  }
}
