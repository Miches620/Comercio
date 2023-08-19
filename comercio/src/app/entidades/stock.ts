export class Stock {
    private id:number;
    private codigoProducto:String;
    private nombreProducto:String;
    private cantidadProducto:number;
    private marcaProducto:String;
    private proveedorProducto:String;
    private costoProducto:number;
    private gananciaProducto:number;
    private porcentajeProducto:number;
    private ingresoProducto:String;
    private vencimientoProducto:String;
    private barrasProducto:String;
    private imagenProducto:String;

    constructor(id:number,codigoProducto:String, nombreProducto:String, cantidadProducto:number, marcaProducto:String, proveedorProducto:String, costoProducto:number,  gananciaProducto:number, porcentajeProducto:number, ingresoProducto:String, vencimientoProducto:String, barrasProducto:String, imagenProducto:String) {
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