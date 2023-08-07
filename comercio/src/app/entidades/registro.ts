export class Registro {
    private id:number;
    private nombreProducto:String;
    private codigoProducto:String;
    private marcaProducto:String;
    private proveedorProducto:String;
    private costoProducto:number;
    private gananciaProducto:number;
    private barrasProducto:String;
    private imagenProducto:String;


    constructor(id:number, nombreProducto:String, codigoProducto:String, marcaProducto:String, proveedorProducto:String, costoProducto:number, gananciaProducto:number, barrasProducto:String, imagenProducto:String) {
        this.id = id;
        this.nombreProducto = nombreProducto;
        this.codigoProducto = codigoProducto;
        this.marcaProducto = marcaProducto;
        this.proveedorProducto = proveedorProducto;
        this.costoProducto = costoProducto;
        this.gananciaProducto = gananciaProducto;
        this.barrasProducto = barrasProducto;
        this.imagenProducto = imagenProducto;
    }
}