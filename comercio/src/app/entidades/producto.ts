export class Producto {
  private id:number;
  private nombreProducto:string;


  constructor(id:number, nombreProducto:string) {
    this.id = id;
    this.nombreProducto = nombreProducto;
  }

  getId(){
    return  this.id;
  }

  getNombre(){
    return this.nombreProducto;
  }

  setId(id:number){
    this.id=id;
  }

  setNombre(producto:string){
    this.nombreProducto = producto;
  }
}