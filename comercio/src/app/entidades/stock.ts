export class Stock {

  private id:number;
  private codigoProducto:string;
  private nombreProducto:string;
  private cantidadProducto:number;
  private precioProducto:number;


  constructor(id:number,codigoProducto:string, nombreProducto:string, cantidadProducto:number, precioProducto:number){
    this.id = id;
    this.codigoProducto = codigoProducto;
    this.nombreProducto = nombreProducto;
    this.cantidadProducto = cantidadProducto;
    this.precioProducto = precioProducto;
  }
}