import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/servicios/admin.service';

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
  tempbarras:string="";
  tempImagen:string="/assets/imagenes/sinImagen.png";
  marcoImagen:any;

  constructor(
    private configurar: AdminService,
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
    this.configurar.obtenerStock().subscribe((data) => {
      this.listaDeStock = data;
    });
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
      console.log(codigo);
      this.lecturaCodeBar.get('formCodeBar')?.setValue("");
      for(let item of this.listaDeProductos){
        if(item.barrasProducto==codigo || item.codigoProducto==codigo){
          this.stock.get('formProducto')?.setValue(item.nombreProducto);
          if(item.imagenProducto!=""||item.imagenProducto!=null){
            this.tempImagen=item.imagenProducto;
            this.marcoImagen.style.border = "2px solid green"
          }else{
            this.tempImagen="/assets/imagenes/sinImagen.png"
            this.marcoImagen.style.border = "2px solid red"
          }
        }
      }
  }
}


}
