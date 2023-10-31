import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { StockService } from "src/app/servicios/stock.service";
import {Stock as StockInterface} from "src/app/entidades/interfaces/stock";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {Carrito as CarritoInterface} from "src/app/entidades/interfaces/carrito";
//import { jsPDF } from "jspdf";


@Component({
  selector: "app-facturacion",
  templateUrl: "./facturacion.component.html",
  styleUrls: ["./facturacion.component.css"]
})
export class FacturacionComponent implements OnInit {

  producto: FormGroup;

  @ViewChild("cantidad")
    cantidad!: ElementRef;

  listadoDeCompra:boolean=true;
  imagenValida:boolean=false;
  mostrarDetalle:boolean=false;

  listaDeStock:StockInterface[]=[];
  carritoDeCompras:CarritoInterface[]=[];

  itemSeleccionado:string="";
  nombreProducto:string="";
  marcaProducto:string="";
  precioProducto:string="";
  idActual:number=0;
  contadorIds:number=0;
  total:number=0;

  obtenerFechaActual:Date=new Date();
  fechaActual:string="";
  horaActual:string="";
  

  tempImagen:string="/assets/imagenes/sinImagen.png";

  constructor(private serviceStock:StockService, private servicioProducto: FormBuilder) {

    this.producto=servicioProducto.group({
      formProducto: ["", Validators.required],
      formCantidad: ["", Validators.required],
    });
  }

  ngOnInit(): void {

    this.recuperarFechaActual();
    this.recuperarHoraActual();

    document.getElementById("producto")?.focus();

    this.serviceStock.obtenerStock().subscribe((data) => {
      this.listaDeStock = data;
    });
  }
  
  verificarImagen(){
    if(this.tempImagen!="/assets/imagenes/sinImagen.png"){
      this.imagenValida= true;
    }else{
      this.imagenValida= false;
    }
  }

  cerrarDetalle(){
    this.mostrarDetalle=false;
    this.itemSeleccionado="";
    this.idActual=0;
    this.producto.reset();
    this.ngOnInit();
  }

  llenarCarrito(){
    if(this.producto.valid){
      for(const item of this.listaDeStock){
        if(item.id==this.idActual){
          const tempCodigoProducto=item.codigoProducto;
          const tempNombreProducto=item.nombreProducto;
          const tempUnidades= this.producto.get("formCantidad")?.value;
          const tempMarca = item.marcaProducto;
          const tempProveedor = item.proveedorProducto;
          const tempCodigoBarras = item.barrasProducto;
          const tempSubtotal = (item.costoProducto+item.gananciaProducto);
          const tempTotal = ((item.costoProducto+item.gananciaProducto)*tempUnidades);
          this.total+=tempTotal;

          const nuevoProducto = {id:this.contadorIds,codigoProducto:tempCodigoProducto,nombreProducto:tempNombreProducto,unidadesProducto:tempUnidades,marcaProducto:tempMarca,proveedorProducto:tempProveedor,codigoBarrasProducto:tempCodigoBarras,subtotalProducto:tempSubtotal,totalProducto:tempTotal};
        
          this.carritoDeCompras.push(nuevoProducto);
          this.contadorIds++;
          this.cerrarDetalle();
          this.ngOnInit();         
        }
      }
    }else{
      alert("Por favor complete los campos antes de avanzar.");
    }
  }

  borrarItemCarrito(id:number){
    for(let i=0; i<this.carritoDeCompras.length;i++){
      if(id==this.carritoDeCompras[i].id){
        this.total-=this.carritoDeCompras[i].totalProducto;
        this.carritoDeCompras.splice(i,1);
        this.cerrarDetalle();
      }
    }
    this.ngOnInit();    
  }

  detalleDeSeleccion(event : Event) {
    const inputElement = event.target as HTMLInputElement;
    this.itemSeleccionado = inputElement.value;
    
    const productoSeleccionado = this.listaDeStock.find(producto => producto.codigoProducto === this.itemSeleccionado);

    if (productoSeleccionado) {
      
      const { id,nombreProducto, marcaProducto, costoProducto, gananciaProducto } = productoSeleccionado;
      this.nombreProducto=nombreProducto;
      this.marcaProducto=marcaProducto;
      this.precioProducto="$"+(costoProducto+gananciaProducto);
      this.idActual=id;
      this.mostrarDetalle=true;
      document.getElementById("cantidad")?.focus();
    }
  }

  aplicarCantidad(event:KeyboardEvent){
    const agregarAlCarrito = document.getElementById("carrito")!;
    if (event.key === "Enter") {
      agregarAlCarrito.click();
    }
  }

  aplicarProducto(event:KeyboardEvent){
    const agregarUnidades = document.getElementById("cantidad")!;
    if (event.key === "Enter") {
      agregarUnidades.focus();
      this.detalleDeSeleccion(event);
    }
  }


  recuperarFechaActual(){

    const dia = this.obtenerFechaActual.getDate();
    const mes = this.obtenerFechaActual.getMonth()+1;
    const anio = this.obtenerFechaActual.getFullYear()-2000;
    this.fechaActual=dia+"/"+mes+"/"+anio;
    if(dia<10){
      this.fechaActual="0"+dia+"/"+mes+"/"+anio;
    }
    if(mes<10){
      this.fechaActual=+dia+"/0"+mes+"/"+anio;
    }
  }

  recuperarHoraActual(){
    
    let horas: number = this.obtenerFechaActual.getHours();
    let minutos: number = this.obtenerFechaActual.getMinutes();
    let segundos: number = this.obtenerFechaActual.getSeconds();

    let horasFormateadas: string = ("0" + horas).slice(-2);
    let minutosFormateados: string = ("0" + minutos).slice(-2);
    let segundosFormateados: string = ("0" + segundos).slice(-2);
    
    this.horaActual=horasFormateadas+":"+minutosFormateados+":"+segundosFormateados;
    horas=0;
    minutos=0;
    segundos=0;
    horasFormateadas="0";
    minutosFormateados="0";
    segundosFormateados="0";

  }

  cobrar(){
    this.recuperarHoraActual();
    const mywindow = window.open("", "PRINT", "height=700,width=700");
    mywindow?.document.write("<!DOCTYPE html>");
    mywindow?.document.write("<html>");
    mywindow?.document.write("<head>");
    mywindow?.document.write("<meta charset='UTF-8'>");
    mywindow?.document.write("<meta name='viewport' content='width=device-width, initial-scale=1.0'>");
    mywindow?.document.write("<title>Recibo Térmico</title>");
    mywindow?.document.write("<style>");
    mywindow?.document.write("* {font-size: 12px;font-family: 'Times New Roman';}");
    mywindow?.document.write("td,th,tr,table {border-top: 1px solid black;border-collapse: collapse;}");
    mywindow?.document.write("td.producto,th.producto {width: 75px;max-width: 75px;}");
    mywindow?.document.write("td.cantidad,th.cantidad {width: 40px;max-width: 40px;word-break: break-all;}");
    mywindow?.document.write("td.precio,th.precio {width: 40px;max-width: 40px;word-break: break-all;}");
    mywindow?.document.write(".centrado {text-align: center;align-content: center;}");
    mywindow?.document.write(".ticket {width: 155px;max-width: 155px;}");
    mywindow?.document.write("img {max-width: inherit;width: inherit;}");
    mywindow?.document.write("</style>");
    mywindow?.document.write("</head>");
    mywindow?.document.write("<body>");
    mywindow?.document.write("<div class='ticket'>");
    //ACA PUEDE IR IMAGEN/LOGO DEL COMERCIO
    mywindow?.document.write("<img src='https://yt3.ggpht.com/-3BKTe8YFlbA/AAAAAAAAAAI/AAAAAAAAAAA/ad0jqQ4IkGE/s900-c-k-no-mo-rj-c0xffffff/photo.jpg'alt='Logotipo'>");
    //ACA PUEDE EDITARSE LA CABECERA Y COLOCAR NOMBRE DEL LOCAL Y DIRECCION
    mywindow?.document.write("<p class='centrado'>Pañalera Pontón<br>Calle falsa 123, Lujan<br>"+this.fechaActual+", "+this.horaActual+"</p>");
    mywindow?.document.write("<table>");
    mywindow?.document.write("<thead>");
    mywindow?.document.write("<tr>");
    mywindow?.document.write("<th class='cantidad'>CANT</th>");
    mywindow?.document.write("<th class='producto'>PRODUCTO</th>");
    mywindow?.document.write("<th class='precio'>$$</th>");
    mywindow?.document.write("</tr>");
    mywindow?.document.write("</thead>");
    mywindow?.document.write("<tbody>");
    for(const item of this.carritoDeCompras){
      mywindow?.document.write("<tr>");
      mywindow?.document.write("<td class='cantidad'>"+item.unidadesProducto+"</td>");
      mywindow?.document.write("<td class='producto'>"+item.nombreProducto+"</td>");
      mywindow?.document.write("<td class='precio'>$"+Math.round(item.totalProducto)+"</td>");
      mywindow?.document.write("</tr>");
    }
    mywindow?.document.write("<tr>");
    mywindow?.document.write("<td class='cantidad'></td>");
    mywindow?.document.write("<td class='producto'>TOTAL</td>");
    mywindow?.document.write("<td class='precio'>$"+Math.round(this.total)+"</td>");
    mywindow?.document.write("</tr>");
    mywindow?.document.write("</tbody>");
    mywindow?.document.write("</table>");
    mywindow?.document.write("<p class='centrado'>¡GRACIAS POR SU COMPRA!<br>Pañalera Pontón</p>"); //ACA Puede ir un mensaje personalizado
    mywindow?.document.write("</div>");
    mywindow?.document.write("</body>");
    mywindow?.document.write("</html>");
    mywindow?.document.close();
    mywindow?.focus();
    setTimeout( () => {
      mywindow?.print();
      mywindow?.close();
    }, 300);
    return true;

    
   
  }
}



