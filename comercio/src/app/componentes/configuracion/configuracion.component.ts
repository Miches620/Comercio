import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin.service';
import { Producto } from 'src/app/entidades/producto';
import { Proveedor } from 'src/app/entidades/proveedor';
import { Marca } from 'src/app/entidades/marca';
import { Registro } from 'src/app/entidades/registro';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  marca:any=[];
  producto:any=[];
  proveedor:any=[];
  formulario:FormGroup;
  ingresoProducto:FormGroup;
  ingresoMarca:FormGroup;
  ingresoProveedor:FormGroup;
  registro:any;
  urlCodBarras:String="";

  constructor(private configurar:AdminService, private servicioFormulario:FormBuilder){
    this.formulario=this.servicioFormulario.group({
      formProducto:['',Validators.required],
      formCodProd:['',Validators.required],
      formMarca:[''],
      formProveedor:[''],
      formCosto:['',Validators.required],
      formGanancia:['',Validators.required],
      formCodBarras:[''],
      formImagen:['']
    })
    this.ingresoProducto=this.servicioFormulario.group({
      formNuevoProducto:['',Validators.required]
    })
    this.ingresoMarca=this.servicioFormulario.group({
      formNuevaMarca:['',Validators.required]
    })
    this.ingresoProveedor=this.servicioFormulario.group({
      formNuevoProveedor:['',Validators.required]
    })
  }

get formProducto(){
  return this.formulario.get('formProducto');
}
  ngOnInit():void{
    this.configurar.obtenerDatosMarcas().subscribe(data =>{
      for(let i=0;i<data.length;i++){
        this.marca[i]=data[i].nombreMarca;
      }
    });
    this.configurar.obtenerDatosProductos().subscribe(data =>{
      for(let i=0;i<data.length;i++){
        this.producto[i]=data[i].nombreProducto;
      }
    });
    this.configurar.obtenerDatosProveedores().subscribe(data =>{
      for(let i=0;i<data.length;i++){
        this.proveedor[i]=data[i].nombreProveedor;
      }
    });
    this.configurar.obtenerRegistro().subscribe(data =>{
      this.registro=data;
    })
  }

obtenerDatosSeleccion(id:String){
  for(let item of this.registro){
    if(item.codigoProducto==id){
      this.formulario.get('formProducto')?.setValue(item.nombreProducto);
      this.formulario.get('formCodProd')?.setValue(item.codigoProducto);
      this.formulario.get('formMarca')?.setValue(item.marcaProducto);
      this.formulario.get('formProveedor')?.setValue(item.proveedorProducto);
      this.formulario.get('formCosto')?.setValue(item.costoProducto);
      this.formulario.get('formGanancia')?.setValue(item.gananciaProducto);
      this.formulario.get('formCodBarras')?.setValue(item.barrasProducto);
      //this.formulario.get('formImagen')?.setValue(item.imagenProducto);
      this.urlCodBarras="https://barcode.tec-it.com/barcode.ashx?data="+id+"&code=Code128&translate-esc=on";

    }
  }
}

  actualizarListado(){
    if (this.formulario.valid){

      let valorRepetido:boolean=false;
      let idNuevoProducto=0;
      let producto = this.formulario.get('formProducto')?.value;
      let codigoDelProducto=this.formulario.get('formCodProd')?.value;
      let marca = this.formulario.get('formMarca')?.value;
      let proveedor = this.formulario.get('formProveedor')?.value;
      let costo = this.formulario.get('formCosto')?.value;
      let ganancia = this.formulario.get('formGanancia')?.value;
      let codigoDeBarrasDelProducto=this.formulario.get('formCodBarras')?.value;
      let imagen = this.formulario.get('formImagen')?.value;
    
      for(let item of this.registro){
        console.log(item)
        if(item.barrasProducto==codigoDeBarrasDelProducto || item.codigoProducto==codigoDelProducto){
          valorRepetido=true;
          alert("INGRESO REPETIDO");
          this.formulario.reset();
        }
      }
      if(valorRepetido==false){
        let nuevoRegistro = new Registro(idNuevoProducto,producto,codigoDelProducto,marca,proveedor,costo,ganancia,codigoDeBarrasDelProducto,imagen);
        this.configurar.agregarRegistro(nuevoRegistro).subscribe({
          next:(data) =>{
            this.formulario.reset();
            this.ngOnInit();
          },
        error:(error) =>{
          alert("Error al intentar actualizar el listado. Por favor intente nuevamente");
        }
        })
      }
    }else{
      this.formulario.markAllAsTouched();
    }
  }

  ingresarNuevoProducto(){
    let valorRepetido:boolean=false;
    let nuevoProducto=this.ingresoProducto.get('formNuevoProducto')?.value;
    let idNuevoProducto=0;
    for(let item of this.producto){
      if(item==nuevoProducto){
        valorRepetido=true;
        alert("VALOR REPETIDO!!!");//Cambiar por algo mas estetico.
        this.ingresoProducto.reset();
      }
    }
    if(valorRepetido==false){
      let nuevoItemProducto = new Producto(idNuevoProducto,nuevoProducto);
      this.configurar.agregarDatosProducto(nuevoItemProducto).subscribe({ 
        next:(data) =>{
              this.ingresoProducto.reset();
              document.getElementById("cerrarModalNuevoProducto")?.click();
          this.ngOnInit();
        },
        error:(error) =>{
          alert("Error al intentar registrar el producto. Por favor intente nuevamente");
        }
    })
    }
}

ingresarNuevaMarca(){
  let valorRepetido:boolean=false;
  let nuevaMarca=this.ingresoMarca.get('formNuevaMarca')?.value;
  let idNuevaMarca=0;
  for(let item of this.marca){
    if(item==nuevaMarca){
      valorRepetido=true;
      alert("VALOR REPETIDO!!!");//Cambiar por algo mas estetico.
      this.ingresoMarca.reset();
    }
  }
  if(valorRepetido==false){
    let nuevoItemMarca = new Marca(idNuevaMarca,nuevaMarca);
    this.configurar.agregarDatosMarca(nuevoItemMarca).subscribe({ 
      next:(data) =>{
            this.ingresoMarca.reset();
            document.getElementById("cerrarModalNuevaMarca")?.click();
        this.ngOnInit();
      },
      error:(error) =>{
        alert("Error al intentar registrar la marca. Por favor intente nuevamente");
      }
  })
  }
}

ingresarNuevoProveedor(){
  let valorRepetido:boolean=false;
  let nuevoProveedor=this.ingresoProveedor.get('formNuevoProveedor')?.value;
  let idNuevoProveedor=0;
  for(let item of this.proveedor){
    if(item==nuevoProveedor){
      valorRepetido=true;
      alert("VALOR REPETIDO!!!");//Cambiar por algo mas estetico.
      this.ingresoProveedor.reset();
    }
  }
  if(valorRepetido==false){
    let nuevoItemProveedor = new Proveedor(idNuevoProveedor,nuevoProveedor);
    this.configurar.agregarDatosProveedor(nuevoItemProveedor).subscribe({ 
      next:(data) =>{
            this.ingresoProveedor.reset();
            document.getElementById("cerrarModalNuevoProveedor")?.click();
        this.ngOnInit();
      },
      error:(error) =>{
        alert("Error al intentar registrar el proveedor. Por favor intente nuevamente");
      }
  })
  }
}
}
  
  
  
  
