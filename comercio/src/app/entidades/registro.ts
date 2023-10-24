export class Registro {
  private id:number;
  private nombreProducto:string;
  private codigoProducto:string;
  private marcaProducto:string;
  private barrasProducto:string;
  private imagenProducto:string;


  constructor(id:number, nombreProducto:string, codigoProducto:string, marcaProducto:string,  barrasProducto:string, imagenProducto:string) {
    this.id = id;
    this.nombreProducto = nombreProducto;
    this.codigoProducto = codigoProducto;
    this.marcaProducto = marcaProducto;
    this.barrasProducto = barrasProducto;
    this.imagenProducto = imagenProducto;
  }

  getId(){
    return this.id;
  }

  getNombreProducto(){
    return this.nombreProducto;
  }

  getCodigoProducto(){
    return this.codigoProducto;
  }

  getMarcaProducto(){
    return this.marcaProducto;
  }

  getBarrasProducto(){
    return this.barrasProducto;
  }

  getImagenProducto(){
    return this.imagenProducto;
  }

  setId(id:number){
    this.id=id;
  }

  setNombreProducto(nombre:string){
    this.nombreProducto=nombre;
  }

  setCodigoProducto(codigo:string){
    this.codigoProducto=codigo;
  }

  setMarcaProducto(marca:string){
    this.marcaProducto=marca;
  }

  setBarrasProducto(barras:string){
    this.barrasProducto=barras;
  }

  setImagenProducto(imagen:string){
    this.imagenProducto=imagen;
  }
}