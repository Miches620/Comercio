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
  url:string="http://localhost:3000/";

  constructor(private http:HttpClient) { }

  //GET:

  obtenerDatosMarcas():Observable<any>{
    return this.http.get(this.url+'marca');
  }
  obtenerDatosProductos():Observable<any>{
    return this.http.get(this.url+'producto');
  }
  
  obtenerDatosProveedores():Observable<any>{
    return this.http.get(this.url+'proveedor');
  }

  obtenerRegistro():Observable<any>{
    return this.http.get(this.url+'registro')
  }

  //POST:

  agregarDatosProducto(producto:Producto):Observable<any>{
    return this.http.post(this.url+'producto',producto)
  }

  agregarDatosProveedor(proveedor:Proveedor):Observable<any>{
    return this.http.post(this.url+'proveedor',proveedor)
  }

  agregarDatosMarca(marca:Marca):Observable<any>{
    return this.http.post(this.url+'marca',marca)
  }

  agregarRegistro(registro:Registro):Observable<any>{
    return this.http.post(this.url+'registro',registro)
  }

  //PUT:

  editarRegistro(id:number,registro:Registro):Observable<any>{
  return this.http.put(this.url+'registro/'+id,registro);
  }

  editarDatosProveedor(id:number,proveedor:Proveedor):Observable<any>{
    return this.http.put(this.url+'proveedor/'+id,proveedor);
  }

  //DELETE:

  borrarRegistro(id:number):Observable<any>{
    return this.http.delete(this.url+'registro/'+id);
  }

  borrarProveedor(id:number):Observable<any>{
    return this.http.delete(this.url+'proveedor/'+id);
  }
}
