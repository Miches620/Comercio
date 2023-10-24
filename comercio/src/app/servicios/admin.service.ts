import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable, Output } from "@angular/core";
import { Observable } from "rxjs";
import {Producto as ProductoInterface} from "../entidades/interfaces/producto";
import {Marca as MarcaInterface} from "../entidades/interfaces/marca";
import {Proveedor as ProveedorInterface} from "../entidades/interfaces/proveedor";
import {Registro as RegistroInterface} from "../entidades/interfaces/registro";



@Injectable({
  providedIn: "root"
})
export class AdminService {
  @Output() navBar: EventEmitter<any> = new EventEmitter();
  url:string="http://localhost:3000/";

  constructor(private http:HttpClient) { }

  //GET:

  obtenerDatosMarcas():Observable<MarcaInterface[]>{
    return this.http.get<MarcaInterface[]>(this.url+"marca");
  }
  obtenerDatosProductos():Observable<ProductoInterface[]>{
    return this.http.get<ProductoInterface[]>(this.url+"producto");
  }
  
  obtenerDatosProveedores():Observable<ProveedorInterface[]>{
    return this.http.get<ProveedorInterface[]>(this.url+"proveedor");
  }

  obtenerRegistro():Observable<RegistroInterface[]>{
    return this.http.get<RegistroInterface[]>(this.url+"registro");
  }

  //POST:

  agregarDatosProducto(producto:ProductoInterface):Observable<ProductoInterface>{
    return this.http.post<ProductoInterface>(this.url+"producto",producto);
  }

  agregarDatosProveedor(proveedor:ProveedorInterface):Observable<ProveedorInterface>{
    return this.http.post<ProveedorInterface>(this.url+"proveedor",proveedor);
  }

  agregarDatosMarca(marca:MarcaInterface):Observable<MarcaInterface>{
    return this.http.post<MarcaInterface>(this.url+"marca",marca);
  }

  agregarRegistro(registro:RegistroInterface):Observable<RegistroInterface>{
    return this.http.post<RegistroInterface>(this.url+"registro",registro);
  }

  //PUT:

  editarRegistro(id:number,registro:RegistroInterface):Observable<RegistroInterface>{
    return this.http.put<RegistroInterface>(this.url+"registro/"+id,registro);
  }

  editarMultiplesRegistros(atributo:string,antiguoValor:string,nuevoValor:string){
    this.http.get<RegistroInterface[]>(
      this.url+"registro/?"+atributo+antiguoValor).subscribe(registros => 
    {
      
      registros.forEach(registro => {
        if(atributo=="marcaProducto="){
          registro.marcaProducto = nuevoValor;
        }else{
          registro.nombreProducto = nuevoValor;
        }
        this.http.put(this.url+"registro/"+registro.id,registro).subscribe();
      });
    });
    this.url="http://localhost:3000/";
  }

  editarDatosProveedor(id:number,proveedor:ProveedorInterface):Observable<ProveedorInterface>{
    return this.http.put<ProveedorInterface>(this.url+"proveedor/"+id,proveedor);
  }

  editarDatosProducto(id:number,producto:ProductoInterface):Observable<ProductoInterface>{
    return this.http.put<ProductoInterface>(this.url+"producto/"+id,producto);
  }

  editarDatosMarca(id:number,marca:MarcaInterface):Observable<MarcaInterface>{
    return this.http.put<MarcaInterface>(this.url+"marca/"+id,marca);
  }

  //DELETE:

  borrarRegistro(id:number):Observable<void>{
    return this.http.delete<void>(this.url+"registro/"+id);
  }

  borrarProveedor(id:number):Observable<void>{
    return this.http.delete<void>(this.url+"proveedor/"+id);
  }

  borrarProducto(id:number):Observable<void>{
    return this.http.delete<void>(this.url+"producto/"+id);
  }

  borrarMarca(id:number):Observable<void>{
    return this.http.delete<void>(this.url+"marca/"+id);
  }
}
