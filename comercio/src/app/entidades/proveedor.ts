export class Proveedor {
    private id:number;
    private nombreProveedor:String;
    private telefonoProveedor:String;
    private emailProveedor:String;


    constructor(id:number, nombreProveedor:String, telefonoProveedor:String, emailProveedor:String){
        this.id=id;
        this.nombreProveedor=nombreProveedor;
        this.telefonoProveedor=telefonoProveedor;
        this.emailProveedor=emailProveedor;
    }
}