import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stock } from 'src/app/entidades/stock';
import { AdminService } from 'src/app/servicios/admin.service';
import { StockService } from 'src/app/servicios/stock.service';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.css'],
})
export class StockComponent implements OnInit {
  marca: any = [];
  producto: any = [];
  listaDeProductos: any = [];
  listaDeProveedores: any = [];
  listaDeMarcas: any = [];
  listaDeStock:any=[]; 
  stock: FormGroup;
  lecturaCodeBar:FormGroup;
  campoVacio: boolean = true;
  id: number = 0;
  porcentaje:any=[];
  listadoCompleto:any=[];
  tempCodProd:string="";
  tempMarca:string="";
  tempBarras:string="";
  tempImagen:string="/assets/imagenes/sinImagen.png";
  tempIngreso:string="";
  marcoImagen:any;
  valorRepetido:number=0;
  obtenerFechaActual:Date=new Date();

  constructor(
    private configurar: AdminService,
    private sStock:StockService,
    private servicioStock: FormBuilder
  ) {
    this.stock = this.servicioStock.group({
      formProducto: ['', Validators.required],
      formCantidad: ['', Validators.required],
      formProveedor: ['',Validators.required],
      formCosto: ['',Validators.required],
      formGanancia: ['',Validators.required],
      formVencimiento:[''],
    });
    this.lecturaCodeBar = this.servicioStock.group({
      formCodeBar:[''],
    });
  }

  ngOnInit(): void {
    this.configurar.obtenerDatosMarcas().subscribe((data) => {
      this.listaDeMarcas=data;
      for (let i = 0; i < data.length; i++) {
        this.marca[i] = data[i].nombreMarca;
      }
    });
    this.configurar.obtenerRegistro().subscribe((data) => {
      this.listaDeProductos=data;
    });
    this.configurar.obtenerDatosProveedores().subscribe((data) => {
      this.listaDeProveedores = data; 
    });
    this.sStock.obtenerStock().subscribe((data) => {
      this.listaDeStock = data;
    });
  }

  reiniciarVariables(){
    this.id=0;
    this.tempCodProd="";
    this.tempMarca="";
    this.tempIngreso="";
    this.tempBarras="";
    this.tempImagen="/assets/imagenes/sinImagen.png";
    this.marcoImagen.style.border = "2px solid red";
  }

  recuperarFechaActual(){

    let dia = this.obtenerFechaActual.getDate();
    let mes = this.obtenerFechaActual.getMonth()+1;
    let anio = this.obtenerFechaActual.getFullYear()-2000;
    if(dia<10){
      this.tempIngreso='0'+dia+'/'+mes+'/'+anio;
    }
    if(mes<10){
        this.tempIngreso=+dia+'/0'+mes+'/'+anio;
    }
  }

  convertirFormatoFecha(fecha:String){
    let anio;
    let mes;
    let dia;
    let formato;
    anio=fecha.substring(2,4);
    mes=fecha.substring(5,7);
    dia=fecha.substring(8);
    formato=dia+'/'+mes+'/'+anio;
    return formato;
  }

  iniciarScanner(){
    const myModal = document.getElementById('codeBar2');
    const myInput = document.getElementById('hiddenCodeBar2');

   myModal?.addEventListener('shown.bs.modal', () => {
    myInput?.focus()})
  }

  recuperarRegistro(){
    this.marcoImagen=document.getElementById('previewImage');
    let codigo = this.lecturaCodeBar.get('formCodeBar')?.value;
    if(codigo!="" || codigo!=null){
      document.getElementById('btnCerrarBarCode2')?.click();
      this.lecturaCodeBar.get('formCodeBar')?.setValue("");
      for(let item of this.listaDeProductos){
        if(item.barrasProducto==codigo || item.codigoProducto==codigo){
          this.stock.get('formProducto')?.setValue(item.nombreProducto);
          if(item.imagenProducto!=""||item.imagenProducto!=null){
            this.tempImagen=item.imagenProducto;
            this.tempMarca=item.marcaProducto;
            this.tempBarras=item.barrasProducto;
            this.tempCodProd=item.codigoProducto;
            this.marcoImagen.style.border = "2px solid green"
          }else{
            this.tempImagen="/assets/imagenes/sinImagen.png"
            this.marcoImagen.style.border = "2px solid red"
          }
        }
      }
  }
}

agregarStock(){

  this.recuperarFechaActual();
  if(this.stock.valid){
  let tempProducto = this.stock.get('formProducto')?.value;
  let tempCantidad = this.stock.get('formCantidad')?.value;
  let tempProveedor = this.stock.get('formProveedor')?.value;
  let tempCosto = this.stock.get('formCosto')?.value;
  let tempGanancia = this.stock.get('formGanancia')?.value;
  let tempVencimiento = this.convertirFormatoFecha(this.stock.get('formVencimiento')?.value);
  let tempPorcentaje = ((tempGanancia*100)/tempCosto)-100;
  
 for(let item of this.listaDeStock){
  if(item.codigoProducto!=this.tempCodProd){
    this.valorRepetido=0;
  }else{
    this.valorRepetido=1;
  }
}
  //ingreso nuevo
   if(this.valorRepetido==0){
    let ingresoTempStock = new Stock(this.id,this.tempCodProd,tempProducto,tempCantidad,this.tempMarca,tempProveedor,tempCosto,tempGanancia,tempPorcentaje,this.tempIngreso,tempVencimiento,this.tempBarras,this.tempImagen);
    this.sStock.agregarStock(ingresoTempStock).subscribe({
      next: (data) =>{
        this.stock.reset();
        this.ngOnInit();
        this.reiniciarVariables();
      },
      error: (error) =>{
        alert('Error al intentar agregar producto al Stock. Por favor intente nuevamente.');
      },
    });
  }else{
  //Actualizacion de Stock Existente

  }
  }else{
    this.stock.markAllAsTouched();
  }

}

}
