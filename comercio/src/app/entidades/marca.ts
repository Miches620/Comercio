export class Marca {
  private id:number;
  private nombreMarca:string;


  constructor(id:number, nombreMarca:string) {
    this.id = id;
    this.nombreMarca = nombreMarca;
  }

  public getId(){
    return this.id;
  }

  public getNombre(){
    return this.nombreMarca;
  }

  public setId(id:number){
    this.id=id;
  }

  public setNombre(marca:string){
    this.nombreMarca=marca;
  }
}