export class Stock {
  private id:number;
  private codigoProducto:string;
  private nombreProducto:string;
  private cantidadProducto:number;
  private marcaProducto:string;
  private proveedorProducto:string;
  private costoProducto:number;
  private gananciaProducto:number;
  private porcentajeProducto:number;
  private ingresoProducto:string;
  private vencimientoProducto:string;
  private barrasProducto:string;
  private imagenProducto:string;

  constructor(id:number,codigoProducto:string, nombreProducto:string, cantidadProducto:number, marcaProducto:string, proveedorProducto:string, costoProducto:number,  gananciaProducto:number, porcentajeProducto:number, ingresoProducto:string, vencimientoProducto:string, barrasProducto:string, imagenProducto:string) {
    this.id = id;
    this.codigoProducto = codigoProducto;
    this.nombreProducto = nombreProducto;
    this.cantidadProducto = cantidadProducto;
    this.marcaProducto = marcaProducto;
    this.proveedorProducto = proveedorProducto;
    this.costoProducto = costoProducto;
    this.gananciaProducto = gananciaProducto;
    this.porcentajeProducto = porcentajeProducto;
    this.ingresoProducto = ingresoProducto;
    this.vencimientoProducto = vencimientoProducto;
    this.barrasProducto = barrasProducto;
    this.imagenProducto = imagenProducto;
  }

   
}