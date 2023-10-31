export class Carrito {

  private id:number;
  private codigoProducto:string;
  private nombreProducto:string;
  private unidadesProducto:number;
  private marcaProducto:string;
  private proveedorProducto:string;
  private codigoBarrasProducto:string;
  private subtotalProducto:number;
  private totalProducto:number;

  constructor(id:number,codigoProducto:string,nombreProducto:string,unidadesProducto:number,marcaProducto:string,proveedorProducto:string,codigoBarrasProducto:string,subtotalProducto:number,totalProducto:number){
    this.id=id;
    this.codigoProducto=codigoProducto;
    this.nombreProducto=nombreProducto;
    this.unidadesProducto=unidadesProducto;
    this.marcaProducto=marcaProducto;
    this.proveedorProducto=proveedorProducto;
    this.codigoBarrasProducto=codigoBarrasProducto;
    this.subtotalProducto=subtotalProducto;
    this.totalProducto=totalProducto;
  }


}