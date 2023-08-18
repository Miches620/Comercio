export class Registro {
    private id:number;
    private nombreProducto:String;
    private codigoProducto:String;
    private marcaProducto:String;
    private barrasProducto:String;
    private imagenProducto:String;


    constructor(id:number, nombreProducto:String, codigoProducto:String, marcaProducto:String,  barrasProducto:String, imagenProducto:String) {
        this.id = id;
        this.nombreProducto = nombreProducto;
        this.codigoProducto = codigoProducto;
        this.marcaProducto = marcaProducto;
        this.barrasProducto = barrasProducto;
        this.imagenProducto = imagenProducto;
    }
}