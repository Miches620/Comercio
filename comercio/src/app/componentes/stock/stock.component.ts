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
  imagenValida:boolean=false;
  
  valorRepetido:number=0;
  obtenerFechaActual:Date=new Date();

  tempProducto:string = "";
  tempCantidad:number = 0;
  tempProveedor:string =  "" ;
  tempCosto:number = 0;
  tempPorcentaje:number = 0;
  tempVencimiento:string =  "" ;
  tempGanancia:number = 0;

  opcion:boolean=false;
  guardarOpcion:boolean=false;

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
      formCodeBar2:[''],
    });
  }

  ngOnInit(): void {

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
    this.imagenValida= false;
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
    if(fecha!=""||fecha!=null){
    anio=fecha.substring(2,4);
    mes=fecha.substring(5,7);
    dia=fecha.substring(8);
    formato=dia+'/'+mes+'/'+anio;
    return formato;
  }
  formato="//";
  return formato;
    }
  
  switchOpcion(){
    if(this.guardarOpcion==false){
    if(this.opcion==true){
      this.opcion=false;
    }else{
      this.opcion=true;
    }
  }
  }

  bloquearOpcion(){
    if(this.guardarOpcion==false){
    this.guardarOpcion=true;
    }else{
      this.guardarOpcion=false;
    }
  }

  iniciarScanner(){
    const myModal = document.getElementById('codeBar2');
    const myInput = document.getElementById('hiddenCodeBar2');
   myModal?.addEventListener('shown.bs.modal', () => {
    myInput?.focus()})
  }

  desbloquearIngresoManual(origen:number){
    if(origen==1){
      document.getElementById('btnCerrarBarCode2')?.click();
    }else{
      document.getElementById('btnCerrarBarCode3')?.click();
      this.lecturaCodeBar.reset();
    }
  }

  recuperarRegistro(origen:number){
    let codigo="";
    if(origen==1){
      codigo = this.lecturaCodeBar.get("formCodeBar")?.value;
    }else{
      codigo = this.lecturaCodeBar.get("formCodeBar2")?.value;
    } 
    if(codigo!="" || codigo!=null){
      if(origen==1){
        document.getElementById('btnCerrarBarCode2')?.click();
        this.lecturaCodeBar.get('formCodeBar')?.setValue("");
      }else{
        document.getElementById('btnCerrarBarCode3')?.click();
        this.lecturaCodeBar.get('formCodeBar2')?.setValue("");
       
      }
      
      for(let item of this.listaDeProductos){
        if(item.barrasProducto==codigo || item.codigoProducto==codigo){
          this.stock.get('formProducto')?.setValue(item.nombreProducto);
          //this.id=item.id; //daria la impresion de que guardar la id en esta instancia es al pedo.
          this.tempImagen=item.imagenProducto;
            this.tempMarca=item.marcaProducto;
            this.tempBarras=item.barrasProducto;
            this.tempCodProd=item.codigoProducto; 
        }
      }
      this.verificarImagen();
  }else{
    alert('Por favor ingrese un registro valido')
  }
}

verificarImagen(){
  if(this.tempImagen!="/assets/imagenes/sinImagen.png"){
    this.imagenValida= true;
  }else{
    this.imagenValida= false;
  }
}

agregarStock(){

  this.recuperarFechaActual();
  if(this.stock.valid){
  this.tempProducto = this.stock.get('formProducto')?.value;
  this.tempCantidad = this.stock.get('formCantidad')?.value;
  this.tempProveedor = this.stock.get('formProveedor')?.value;
  this.tempCosto = this.stock.get('formCosto')?.value;
  this.tempPorcentaje = this.stock.get('formGanancia')?.value;
  this.tempVencimiento = this.convertirFormatoFecha(this.stock.get('formVencimiento')?.value);
  this.tempGanancia = ((this.tempCosto/100)*this.tempPorcentaje);
  this.tempGanancia = Math.round(this.tempGanancia * 100) / 100;

 //verifica que si el ingreso fue por QR, el mismo exista dentro de la lista de productos registrados en CONFIGURAR
  if(this.tempCodProd==null || this.tempCodProd==""){
    for(let item of this.listaDeProductos){
      if(item.nombreProducto == this.tempProducto){
        this.tempImagen=item.imagenProducto;
        this.tempMarca=item.marcaProducto;
        this.tempBarras=item.barrasProducto;
        this.tempCodProd=item.codigoProducto;
      }
    }
    this.verificarImagen();
  }
  if(this.id==0){
    for(let item of this.listaDeStock){
      if(item.nombreProducto==this.tempProducto && item.proveedorProducto==this.tempProveedor && item.vencimientoProducto==this.tempVencimiento){
        this.id=item.id;
      }
    }
  }
  this.valorRepetido=0;
  //si Existe como producto ya registrado, verifica que en la lista de STOCK de esta pantalla no exista cargado exactamente el mismo valor
   
 for(let item of this.listaDeStock){
  if(item.codigoProducto==this.tempCodProd && item.proveedorProducto==this.tempProveedor && item.vencimientoProducto==this.tempVencimiento){
    this.valorRepetido=1;
  }
}
//si el valor ya existiera dentro de la lista de STOCK, el boton de agregar tendra un comportamiento extra. a saber:
  
    
  //ingreso nuevo
   if(this.valorRepetido==0){
    this.id=0;
    let ingresoTempStock = new Stock(this.id,this.tempCodProd,this.tempProducto,this.tempCantidad,this.tempMarca,this.tempProveedor,this.tempCosto,this.tempGanancia,this.tempPorcentaje,this.tempIngreso,this.tempVencimiento,this.tempBarras,this.tempImagen);
    this.sStock.agregarStock(ingresoTempStock).subscribe({
      next: (data) =>{
        this.stock.reset();
        this.ngOnInit();
        this.reiniciarVariables();
      },
      error: (e) =>{
        alert('Error al intentar agregar producto al Stock. Por favor intente nuevamente.' + e);
      },
    });
  }else{
  //Actualizacion de Stock Existente
  for(let item of this.listaDeStock){
  if(item.id==this.id){
    this.tempCantidad+=item.cantidadProducto;
    this.tempIngreso=item.ingresoProducto;
  }
  }
  let seleccionEditada = new Stock(
    this.id,
    this.tempCodProd,
    this.tempProducto,
    this.tempCantidad,
    this.tempMarca,
    this.tempProveedor,
    this.tempCosto,
    this.tempGanancia,
    this.tempPorcentaje,
    this.tempIngreso,
    this.tempVencimiento,
    this.tempBarras,
    this.tempImagen);
  this.sStock.modificarStock(this.id, seleccionEditada).subscribe({
    next: (data) => {
      alert('Stock Actualizado Correctamente');
      this.ngOnInit();
      this.resetearModal();
    },
    error: (error) => {
      alert(
        'Error al intentar actualizar el stock. Por favor intente nuevamente'
      );
    },
  });
  }
  }else{
    this.stock.markAllAsTouched();
  }

}

obtenerDatosSeleccion(id: number) {
  this.id = id;
  for (let item of this.listaDeStock) {
    if (item.id == id) {
      this.stock.get('formProducto')?.setValue(item.nombreProducto);
      this.stock.get('formCantidad')?.setValue(item.cantidadProducto);
      this.stock.get('formProveedor')?.setValue(item.proveedorProducto);
      this.stock.get('formCosto')?.setValue(item.costoProducto);
      this.stock.get('formGanancia')?.setValue(item.porcentajeProducto);
      if(item.vencimientoProducto!="//"||item.vencimientoProducto!=""){
      this.stock.get('formVencimiento')?.setValue('20'+item.vencimientoProducto.substring(6) + '-' + item.vencimientoProducto.substring(3,5) + '-' +item.vencimientoProducto.substring(0,2));
      }
        this.tempIngreso = item.ingresoProducto;
        this.tempCodProd = item.codigoProducto;
        this.tempMarca = item.marcaProducto;
        this.tempBarras = item.barrasProducto;
        this.tempImagen = item.imagenProducto;
        this.verificarImagen();
    }
  }
}

resetearModal() {
  this.stock.reset();
  this.id = 0;
  this.tempCodProd = "";
  this.tempMarca = "";
  this.tempBarras = "";
  this.tempIngreso= "";
  this.tempImagen="/assets/imagenes/sinImagen.png"
  this.imagenValida= false;
  this.valorRepetido=0;
}

borrarStockSeleccionado() {
  if (this.stock.valid && this.id != 0) {
    this.sStock.borrarStock(this.id).subscribe({
      next: (data) => {
        alert('Seleccion eliminada correctamente');
        this.ngOnInit();
        this.resetearModal();
      },
      error: (error) => {
        alert('Error al borrar la seleccion. Por favor intente nuevamente');
      },
    });
    document.getElementById('cerrarModalEliminar')?.click();
  }
  this.id = 0;
}

editarRegistroSeleccionado() {
  if (this.stock.valid) {
    let valorRepetido: boolean = false;
    this.tempProducto = this.stock.get('formProducto')?.value;
    this.tempCantidad = this.stock.get('formCantidad')?.value;
    this.tempProveedor = this.stock.get('formProveedor')?.value;
    this.tempCosto = this.stock.get('formCosto')?.value;
    this.tempPorcentaje = this.stock.get('formGanancia')?.value;
    this.tempVencimiento = this.convertirFormatoFecha(this.stock.get('formVencimiento')?.value);
    if(this.tempVencimiento=="//" || this.tempVencimiento=="//--"){
      this.tempVencimiento="";
    }
    this.tempGanancia = (((this.tempCosto/100)*this.tempPorcentaje));
    this.tempGanancia = Math.round(this.tempGanancia * 100) / 100;

    for (let item of this.listaDeStock) {
      if (
        item.nombreProducto == this.tempProducto &&
        //item.cantidadProducto == this.tempCantidad &&
        item.proveedorProducto == this.tempProveedor &&
        item.vencimientoProducto == this.tempVencimiento &&
        item.id != this.id
        
      ) {
        valorRepetido = true;
        alert(
          'Atencion: Esta duplicando un registro ya existente. Por favor verifique y vuelva a intentar.'
        );
      }
    }
    if (valorRepetido == false) {
      let seleccionEditada = new Stock(
        this.id,
        this.tempCodProd,
        this.tempProducto,
        this.tempCantidad,
        this.tempMarca,
        this.tempProveedor,
        this.tempCosto,
        this.tempGanancia,
        this.tempPorcentaje,
        this.tempIngreso,
        this.tempVencimiento,
        this.tempBarras,
        this.tempImagen);

      this.sStock.modificarStock(this.id, seleccionEditada).subscribe({
        next: (data) => {
          alert('Registro Actualizado Correctamente');
          this.ngOnInit();
          this.resetearModal();
        },
        error: (error) => {
          alert(
            'Error al intentar actualizar el registro. Por favor intente nuevamente'
          );
        },
      });
    }
  } else {
    this.stock.markAllAsTouched();
    alert('Atencion! uno o mas campos requeridos no han sido completados!!');
  }
}

}
