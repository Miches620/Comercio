import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../entidades/producto';
import { Marca } from '../entidades/marca';
import { Proveedor } from '../entidades/proveedor';
import { Registro } from '../entidades/registro';


@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  //GET:

  obtenerDatosMarcas():Observable<any>{
    return this.http.get('http://localhost:3000/marca');
  }
  obtenerDatosProductos():Observable<any>{
    return this.http.get('http://localhost:3000/producto');
  }
  
  obtenerDatosProveedores():Observable<any>{
    return this.http.get('http://localhost:3000/proveedor');
  }

  obtenerRegistro():Observable<any>{
    return this.http.get('http://localhost:3000/registro')
  }

  //POST:

  agregarDatosProducto(producto:Producto):Observable<any>{
    return this.http.post('http://localhost:3000/producto',producto)
  }

  agregarDatosProveedor(proveedor:Proveedor):Observable<any>{
    return this.http.post('http://localhost:3000/proveedor',proveedor)
  }

  agregarDatosMarca(marca:Marca):Observable<any>{
    return this.http.post('http://localhost:3000/marca',marca)
  }

  agregarRegistro(registro:Registro):Observable<any>{
    return this.http.post('http://localhost:3000/registro',registro)
  }
}
