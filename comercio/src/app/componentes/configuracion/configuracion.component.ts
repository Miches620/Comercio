import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms'

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent implements OnInit {
  marca:any;
  producto:any;
  proveedor:any;
  formulario:FormGroup;
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
  }

get formProducto(){
  return this.formulario.get('formProducto');
}
  ngOnInit():void{
    this.configurar.obtenerDatosMarcas().subscribe(data =>{
      this.marca=data["marca"];
    });
    this.configurar.obtenerDatosProductos().subscribe(data =>{
      this.producto=data["producto"];
    })
    this.configurar.obtenerDatosProveedores().subscribe(data =>{
      this.proveedor=data["proveedor"];
    })
  }

  actualizarListado(){
    if (this.formulario.valid){
      this.formulario.reset();
    }else{
      this.formulario.markAllAsTouched();
    }
  }

}


