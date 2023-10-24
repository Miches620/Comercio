export class Proveedor {
  private id:number;
  private nombreProveedor:string;
  private telefonoProveedor:string;
  private emailProveedor:string;


  constructor(id:number, nombreProveedor:string, telefonoProveedor:string, emailProveedor:string){
    this.id=id;
    this.nombreProveedor=nombreProveedor;
    this.telefonoProveedor=telefonoProveedor;
    this.emailProveedor=emailProveedor;
  }

  getId(){
    return this.id;
  }

  getNombreProveedor(){
    return this.nombreProveedor;
  }

  getTelefonoProveedor(){
    return this.telefonoProveedor;
  }

  getEmailProveedor(){
    return this.emailProveedor;
  }

  setId(id:number){
    this.id=id;
  }

  setNombreProveedor(nombre:string){
    this.nombreProveedor=nombre;
  }

  setTelefonoProveedor(telefono:string){
    this.telefonoProveedor=telefono;
  }

  setEmailProveedor(email:string){
    this.emailProveedor=email;
  }
}