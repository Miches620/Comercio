import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Historial } from "src/app/entidades/historial";
import { Stock } from "src/app/entidades/stock";
import { AdminService } from "src/app/servicios/admin.service";
import { StockService } from "src/app/servicios/stock.service";
import {Registro} from "src/app/entidades/interfaces/registro";
import {Proveedor} from "src/app/entidades/interfaces/proveedor";
import {Historial as HistorialInterface} from "src/app/entidades/interfaces/historial";
import {Stock as StockInterface} from "src/app/entidades/interfaces/stock";
import { Producto } from "src/app/entidades/interfaces/producto";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.css"],
})
export class StockComponent implements OnInit {
  listaDeProductos: Producto[] = [];
  listaDeProveedores: Proveedor[] = [];
  listaDeRegistros: Registro[]=[];
  listaDeIngresos:HistorialInterface[]=[];
  listaDeStock:StockInterface[]=[];
  listaDeMarcas:string[]=[]; 

  stock: FormGroup;
  lecturaCodeBar:FormGroup;
  busqueda: FormGroup;
  id: number = 0;

  tempCodigoProducto:string="";
  tempMarca:string="";
  tempBarras:string="";
  tempImagen:string="/assets/imagenes/sinImagen.png";
  tempIngreso:string="";
  imagenValida:boolean=false;
  
  valorRepetido:number=0;
  obtenerFechaActual:Date=new Date();
  filtroDeBusqueda:string="";
  seleccionDeBusqueda:string="codigoInput";

  tempProducto:string = "";
  tempCantidad:number = 0;
  tempCantidadValorViejo:number=0;
  tempProveedor:string =  "" ;
  tempCosto:number = 0;
  tempPorcentaje:number = 0;
  tempVencimiento:string =  "" ;
  tempGanancia:number = 0;

  precioProducto= this.tempCosto+this.tempGanancia;

  opcion:boolean=false;
  guardarOpcion:boolean=false;
  campoVacio: boolean = true;
  stockOHistorial: boolean=false;

  constructor(
    private configurar: AdminService,
    private serviceStock:StockService,
    private servicioStock: FormBuilder
  ) {
    this.stock = this.servicioStock.group({
      formProducto: ["", Validators.required],
      formCantidad: ["", Validators.required],
      formMarca: ["",Validators.required],
      formProveedor: ["",Validators.required],
      formCosto: ["",Validators.required],
      formGanancia: ["",Validators.required],
      formVencimiento:[""],
    });
    this.lecturaCodeBar = this.servicioStock.group({
      formCodeBar:[""],
      formCodeBar2:[""],
    });
    this.busqueda = this.servicioStock.group({
      formBarraDeBusqueda:[""]
    });
  }

  ngOnInit(): void {

    this.configurar.obtenerRegistro().subscribe((data) =>{
      this.listaDeRegistros = data;
    });

    this.configurar.obtenerDatosProductos().subscribe((data) => {
      this.listaDeProductos=data;
    });
    this.configurar.obtenerDatosProveedores().subscribe((data) => {
      this.listaDeProveedores = data; 
    });
    this.serviceStock.obtenerHistorial().subscribe((data) => {
      this.listaDeIngresos = data;
    });
    this.serviceStock.obtenerStock().subscribe((data) => {
      this.listaDeStock = data;
    });
  }

  get listaDeItemsFiltrados():HistorialInterface[] {
    if(this.seleccionDeBusqueda=="codigoInput"){
      document.getElementById("buscadorInput")?.setAttribute("placeholder","");
      return this.listaDeIngresos.filter(item => item.codigoProducto.toLowerCase().includes(this.busqueda.get("formBarraDeBusqueda")?.value.toLowerCase()));
    }else if (this.seleccionDeBusqueda=="productoInput"){
      document.getElementById("buscadorInput")?.setAttribute("placeholder","");
      return this.listaDeIngresos.filter(item => item.nombreProducto.toLowerCase().includes(this.busqueda.get("formBarraDeBusqueda")?.value.toLowerCase()));
    }else if (this.seleccionDeBusqueda=="fechaInput"){
      document.getElementById("buscadorInput")?.setAttribute("placeholder","AAAA/MM/DD");
      const fechaFiltro = this.convertirFormatoFecha(this.busqueda.get("formBarraDeBusqueda")?.value);
      if(fechaFiltro.length>7){
        return this.listaDeIngresos.filter(item =>  item.ingresoProducto.toLowerCase().includes(this.convertirFormatoFecha(this.busqueda.get("formBarraDeBusqueda")?.value)));
      }else{
        return this.listaDeIngresos;
      }
    }else{
      document.getElementById("buscadorInput")?.setAttribute("placeholder","");
      return this.listaDeIngresos;
    }
  }

  get stockFiltrado():StockInterface[] {
    if(this.seleccionDeBusqueda=="codigoInput"){
      document.getElementById("buscadorInput")?.setAttribute("placeholder","");
      return this.listaDeStock.filter(item => item.codigoProducto.toLowerCase().includes(this.busqueda.get("formBarraDeBusqueda")?.value.toLowerCase()));
    }else if (this.seleccionDeBusqueda=="productoInput"){
      document.getElementById("buscadorInput")?.setAttribute("placeholder","");
      return this.listaDeStock.filter(item => item.nombreProducto.toLowerCase().includes(this.busqueda.get("formBarraDeBusqueda")?.value.toLowerCase()));
    }else{
      document.getElementById("buscadorInput")?.setAttribute("placeholder","");
      return this.listaDeStock;
    }
  }

  cambiarDatosDeTabla(tabla:number){
    let botonDeseleccionado:HTMLElement;
    let botonSeleccionado:HTMLElement;
    let tituloDeTabla:HTMLElement;
    this.SeleccionarFiltro("codigoInput");
    // eslint-disable-next-line prefer-const
    tituloDeTabla = document.getElementById("tituloDeTabla")!;
    if(tabla==2){
      this.stockOHistorial=true;
      botonDeseleccionado = document.getElementById("btnRegistro")!;
      botonDeseleccionado.style.color="#fff";
      botonSeleccionado = document.getElementById("btnStock")!;
      botonSeleccionado.style.color="#0d6efd";
      tituloDeTabla.textContent="Stock";
      this.resetearModal();
    }else{
      this.stockOHistorial=false;
      botonDeseleccionado = document.getElementById("btnStock")!;
      botonDeseleccionado.style.color="#fff";
      botonSeleccionado = document.getElementById("btnRegistro")!;
      botonSeleccionado.style.color="#0d6efd";
      tituloDeTabla.textContent="Historial";
    }
  }

  reiniciarVariables(){
    this.id=0;
    this.tempCodigoProducto="";
    this.tempMarca="";
    this.tempIngreso="";
    this.tempBarras="";
    this.tempImagen="/assets/imagenes/sinImagen.png";
    this.imagenValida= false;
  }

  recuperarFechaActual(){

    const dia = this.obtenerFechaActual.getDate();
    const mes = this.obtenerFechaActual.getMonth()+1;
    const anio = this.obtenerFechaActual.getFullYear()-2000;
    this.tempIngreso=dia+"/"+mes+"/"+anio;
    if(dia<10){
      this.tempIngreso="0"+dia+"/"+mes+"/"+anio;
    }
    if(mes<10){
      this.tempIngreso=+dia+"/0"+mes+"/"+anio;
    }
  }

  convertirFormatoFecha(fecha:string){
    let anio;
    let mes;
    let dia;
    let formato;
    if(fecha!=""||fecha!=null){
      anio=fecha.substring(2,4);
      mes=fecha.substring(5,7);
      dia=fecha.substring(8);
      formato=dia+"/"+mes+"/"+anio;
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

  SeleccionarFiltro(label:string){
    this.busqueda.get("formBarraDeBusqueda")?.setValue("");
    const lblCodigo = document?.getElementById("lblCodigo");
    const lblProducto = document?.getElementById("lblProducto");
    const lblFecha = document?.getElementById("lblFecha");
    const lblsRadios:HTMLElement[] = [lblFecha!, lblProducto!, lblCodigo!];
    for(const item of lblsRadios){
      if(item.getAttribute("for")===label){
        this.ngOnInit();
        item.style.textDecoration="underline";
        this.seleccionDeBusqueda=item.getAttribute("for")!;
      }else{
        item.style.textDecoration="none";
         
      }
    }

  }

  iniciarScanner(){
    const myModal = document.getElementById("codeBar2");
    const myInput = document.getElementById("hiddenCodeBar2");
    myModal?.addEventListener("shown.bs.modal", () => {
      myInput?.focus();});
  }

  desbloquearIngresoManual(origen:number){
    if(origen==1){
      document.getElementById("btnCerrarBarCode2")?.click();
    }else{
      document.getElementById("btnCerrarBarCode3")?.click();
      this.lecturaCodeBar.reset();
    }
  }

  cerrarModal(modal:string){
    document.getElementById(modal)?.click();
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
        this.cerrarModal("btnCerrarBarCode2");
        this.lecturaCodeBar.reset();
      }else{
        this.cerrarModal("btnCerrarBarCode3");
        this.lecturaCodeBar.reset();
       
      }
      
      for(const item of this.listaDeRegistros){
        if(item.barrasProducto==codigo || item.codigoProducto==codigo){
          this.stock.get("formProducto")?.setValue(item.nombreProducto);
          this.tempImagen=item.imagenProducto;
          this.tempMarca=item.marcaProducto;
          this.tempBarras=item.barrasProducto;
          this.tempCodigoProducto=item.codigoProducto; 
        }
      }
      this.verificarImagen();
    }else{
      alert("Por favor ingrese un registro valido");
    }
  }

  verificarImagen(){
    if(this.tempImagen!="/assets/imagenes/sinImagen.png"){
      this.imagenValida= true;
    }else{
      this.imagenValida= false;
    }
  }

  recuperarIngresosFormulario(){
    this.tempProducto = this.stock.get("formProducto")?.value;
    this.tempCantidad = this.stock.get("formCantidad")?.value;
    this.tempMarca=this.stock.get("formMarca")?.value;
    this.tempProveedor = this.stock.get("formProveedor")?.value;
    this.tempCosto = this.stock.get("formCosto")?.value;
    this.tempPorcentaje = this.stock.get("formGanancia")?.value;
    this.tempVencimiento = this.convertirFormatoFecha(this.stock.get("formVencimiento")?.value);
    if(this.tempVencimiento=="//" || this.tempVencimiento=="//--"){
      this.tempVencimiento="";
    }
    this.tempGanancia = ((this.tempCosto/100)*this.tempPorcentaje);
    this.tempGanancia = Math.round(this.tempGanancia * 100) / 100;
  }


  verificarMarcas(){
    this.listaDeMarcas=[];
    this.tempProducto = this.stock.get("formProducto")?.value;
    
    for(const item of this.listaDeRegistros){
      if(item.nombreProducto==this.tempProducto){
        this.listaDeMarcas.push(item.marcaProducto);
      }
    }
    document.getElementById("cantidadProducto")?.focus();
    if(this.listaDeMarcas.length<2){
      const unicaMarca = this.listaDeMarcas;
      this.stock.get("formMarca")?.setValue(unicaMarca);
    }  
  }
  //dentro de agregarStock verificar si es preferible usar item.vencimientoProducto o item.ingresoProducto para encontrar repetidos
  //considero que es mejor que el repetido suceda si el item.ingresoProducto corresponde con el mismo dia donde se esta haciendo
  agregarStock(){

    this.recuperarFechaActual();
    if(this.stock.valid){
      this.recuperarIngresosFormulario();

      //verifica que si el ingreso fue por QR, el mismo exista dentro de la lista de productos registrados en CONFIGURAR
      if(this.tempCodigoProducto==null || this.tempCodigoProducto==""){
        for(const item of this.listaDeRegistros){
          if(item.nombreProducto == this.tempProducto && item.marcaProducto == this.tempMarca){
            this.tempImagen=item.imagenProducto;
            this.tempBarras=item.barrasProducto;
            this.tempCodigoProducto=item.codigoProducto;
          }
          else{
            alert("Error al intentar verificar la existencia del producto. Verifique que el mismo exista dentro del catalogo de productos y vuelva intentar.");
          }
        }
        this.verificarImagen();
      }
      else{
        alert("Error de lectura de codigo. Por favor verifique el ingreso y vuelva a intentar.");
      }
      if(this.id==0){
        for(const item of this.listaDeIngresos){
          if(item.nombreProducto==this.tempProducto && item.proveedorProducto==this.tempProveedor && item.vencimientoProducto==this.tempVencimiento){
            this.id=item.id;
          }
        }
      }
      this.valorRepetido=0;
      //si Existe como producto ya registrado, verifica que en la lista de STOCK de esta pantalla no exista cargado exactamente el mismo valor
   
      for(const item of this.listaDeIngresos){
        if(item.codigoProducto==this.tempCodigoProducto && item.proveedorProducto==this.tempProveedor && item.vencimientoProducto==this.tempVencimiento){
          this.valorRepetido=1;
        }
      }
      //si el valor ya existiera dentro de la lista de STOCK, el boton de agregar tendra un comportamiento extra:
  
    
      //ingreso nuevo
      if(this.valorRepetido==0){
        this.id=0;
        const ingresoTempHistorial = new Historial(
          this.id,
          this.tempCodigoProducto,
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
          this.tempImagen
        );
       
        this.serviceStock.agregarHistorial(ingresoTempHistorial).subscribe({
          next: () =>{
            this.nuevoIngresoStock();           
            this.stock.reset();
            this.ngOnInit();
            this.reiniciarVariables();
          },
          error: (e) =>{
            alert("Error al intentar agregar producto al Stock. Por favor intente nuevamente." + e);
          },
        });
      }else{
        //Actualizacion de Stock Existente
        for(const item of this.listaDeIngresos){
          if(item.id==this.id){
            this.tempCantidad+=item.cantidadProducto;
            this.tempIngreso=item.ingresoProducto;
          }
        }
        this.editarRegistro();
        this.nuevoIngresoStock();
      }
    }else{
      this.stock.markAllAsTouched();
      alert("Atencion! uno o mas campos requeridos no han sido completados!!");
    }

  }
  nuevoIngresoStock(){
    const registradoEnStock = this.listaDeStock.find(producto => producto.codigoProducto=== this.tempCodigoProducto);
    
    if(!registradoEnStock){
      const ingresoTempStock = new Stock(
        this.id,
        this.tempCodigoProducto,
        this.tempProducto,
        this.tempCantidad,
        this.precioProducto
      );
  
      this.serviceStock.agregarStock(ingresoTempStock).subscribe({
        next: () =>{}
      });
    }else{
      for(const item of this.listaDeStock){
        if(item.codigoProducto==this.tempCodigoProducto){
          this.id=item.id;
          this.tempCantidad+=item.cantidadProducto;

          const ingresoTempStock = new Stock(
            this.id,
            this.tempCodigoProducto,
            this.tempProducto,
            this.tempCantidad,
            this.precioProducto
          );

          this.serviceStock.modificarStock(this.id,ingresoTempStock).subscribe({
            next: () =>{}
          });
        }
      }
    }
    

  }


  edicionColateralDeStock(){

    let stockProductos:number=0;
    
    //Verifica que valor dentro del input de cantidad era el mas grande
    if(this.tempCantidadValorViejo>this.tempCantidad){ 
      stockProductos= (this.tempCantidadValorViejo - this.tempCantidad) *-1;
    }else{
      stockProductos= this.tempCantidad - this.tempCantidadValorViejo;
    }
    //en base a eso, stockProductos tomara un valor negativo o uno positivo

    for(const item of this.listaDeStock){
      if(item.codigoProducto == this.tempCodigoProducto ){
        this.id=item.id;
        this.tempCodigoProducto=item.codigoProducto;
        this.tempProducto=item.nombreProducto;
        this.precioProducto=item.precioProducto;
        this.tempCantidad=item.cantidadProducto + stockProductos;
      }
    }

    const ingresoTempStock = new Stock(
      this.id,
      this.tempCodigoProducto,
      this.tempProducto,
      this.tempCantidad,
      this.precioProducto
    );
    this.serviceStock.modificarStock(this.id, ingresoTempStock).subscribe({
      next: () =>{}
    });
  
  }
  obtenerDatosSeleccion(id: number) {
    this.id = id;
    for (const item of this.listaDeIngresos) {
      if (item.id == id) {
        this.stock.get("formProducto")?.setValue(item.nombreProducto);
        this.stock.get("formCantidad")?.setValue(item.cantidadProducto);
        this.stock.get("formMarca")?.setValue(item.marcaProducto);
        this.stock.get("formProveedor")?.setValue(item.proveedorProducto);
        this.stock.get("formCosto")?.setValue(item.costoProducto);
        this.stock.get("formGanancia")?.setValue(item.porcentajeProducto);
        if(item.vencimientoProducto!="//"||item.vencimientoProducto!=null){
          this.stock.get("formVencimiento")?.setValue("20"+item.vencimientoProducto.substring(6) + "-" + item.vencimientoProducto.substring(3,5) + "-" +item.vencimientoProducto.substring(0,2));
        }
        this.tempIngreso = item.ingresoProducto;
        this.tempCodigoProducto = item.codigoProducto;
        this.tempBarras = item.barrasProducto;
        this.tempImagen = item.imagenProducto;
        this.tempCantidadValorViejo=this.stock.get("formCantidad")?.value;
        this.verificarImagen();
      }
    }
  }

  resetearModal() {
    this.stock.reset();
    this.id = 0;
    this.tempCodigoProducto = "";
    this.tempMarca = "";
    this.tempBarras = "";
    this.tempIngreso= "";
    this.tempImagen="/assets/imagenes/sinImagen.png";
    this.imagenValida= false;
    this.valorRepetido=0;
  }

  borrarStockSeleccionado() {
    if (this.stock.valid && this.id != 0) {
      this.serviceStock.borrarHistorial(this.id).subscribe({
        next: () => {
          alert("Seleccion eliminada correctamente");
          this.ngOnInit();
          this.resetearModal();
        },
        error: (e) => {
          alert("Error al borrar la seleccion. Por favor intente nuevamente. "+e);
        },
      });
      this.cerrarModal("cerrarModalEliminar");
    }
    this.id = 0;
  }

  editarRegistroSeleccionado() {
    if (this.stock.valid) {
      let valorRepetido: boolean = false;
      this.recuperarIngresosFormulario();

      for (const item of this.listaDeIngresos) {
        if (
          item.nombreProducto == this.tempProducto &&
        item.proveedorProducto == this.tempProveedor &&
        item.vencimientoProducto == this.tempVencimiento &&
        item.id != this.id
        
        ) {
          valorRepetido = true;
          alert(
            "Atencion: Esta intentando duplicar un registro ya existente. Por favor verifique y vuelva a intentar."
          );
        }
      }
      if (valorRepetido == false) {
        this.editarRegistro();
      }
    } else {
      this.stock.markAllAsTouched();
      alert("Atencion! uno o mas campos requeridos no han sido completados!!");
    }
  }

  editarRegistro(){
    const seleccionEditada = new Historial(
      this.id,
      this.tempCodigoProducto,
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

    this.serviceStock.modificarHistorial(this.id, seleccionEditada).subscribe({
      next: () => {
        alert("Registro Actualizado Correctamente");
        this.edicionColateralDeStock();
        this.ngOnInit();
        this.resetearModal();
      },
      error: (e) => {
        alert(
          "Error al intentar actualizar el registro. Por favor intente nuevamente. "+e
        );
      },
    });
    
    
  }
}
