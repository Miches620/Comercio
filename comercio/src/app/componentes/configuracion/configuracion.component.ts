import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css']
})
export class ConfiguracionComponent {
  marca:any;
  producto:any;
  proveedor:any;
  constructor(private configurar:AdminService){}

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
}
