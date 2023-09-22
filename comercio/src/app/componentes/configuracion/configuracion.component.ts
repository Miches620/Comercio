import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin.service';
import { Producto } from 'src/app/entidades/producto';
import { Proveedor } from 'src/app/entidades/proveedor';
import { Marca } from 'src/app/entidades/marca';
import { Registro } from 'src/app/entidades/registro';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import { delay } from 'rxjs';


@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent implements OnInit {
  marca: any = [];
  producto: any = [];
  listaDeProductos: any = [];
  listaDeProveedores: any = [];
  listaDeMarcas: any = [];
  formulario: FormGroup;
  proveedores: FormGroup;
  ingresoProducto: FormGroup;
  ingresoMarca: FormGroup;
  ingresoProveedor: FormGroup;
  lecturaCodeBar:FormGroup;
  collapseProducto: boolean = false;
  collapseProveedor: boolean = true;
  collapseGastos: boolean = false;
  registro: any;
  urlCodBarras: string = '';
  campoVacio: boolean = true;
  id: number = 0;
  cacheDeEdicion:any;

  constructor(
    private configurar: AdminService,
    private servicioFormulario: FormBuilder
  ) {
    this.formulario = this.servicioFormulario.group({
      formProducto: ['', Validators.required],
      formCodProd: ['', Validators.required],
      formMarca: ['', Validators.required],
      formCodBarras: ['', Validators.required],
      formImagen: [''],
    });
    this.proveedores = this.servicioFormulario.group({
      formProveedor: ['', Validators.required],
      formTelefono: ['', Validators.minLength(10)],
      formEmail: [
        '',
        Validators.pattern(
          "[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]([.]?[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-])+@[a-zA-Z0-9]([^@&%$/()=?¿!.,:;]|d)+[a-zA-Z0-9][.][a-zA-Z]{2,4}([.][a-zA-Z]{2})?"
        ),
      ],
    });
    this.ingresoProducto = this.servicioFormulario.group({
      formNuevoProducto: ['', Validators.required],
    });
    this.ingresoMarca = this.servicioFormulario.group({
      formNuevaMarca: ['', Validators.required],
    });
    this.ingresoProveedor = this.servicioFormulario.group({
      formNuevoProveedor: ['', Validators.required],
    });
    this.lecturaCodeBar = this.servicioFormulario.group({
      formCodeBar:[''],
    })
  }

  get nuevoProducto() {
    return this.ingresoProducto.get('formNuevoProducto');
  }

  get nuevaMarca() {
    return this.ingresoMarca.get('formNuevaMarca');
  }

  get nuevoProveedor() {
    return this.ingresoProveedor.get('formNuevoProveedor');
  }

  ngOnInit(): void {
    this.configurar.obtenerDatosMarcas().subscribe((data) => {
      this.listaDeMarcas=data;
      for (let i = 0; i < data.length; i++) {
        this.marca[i] = data[i].nombreMarca;
      }
    });
    this.configurar.obtenerDatosProductos().subscribe((data) => {
      this.listaDeProductos=data;
      for (let i = 0; i < data.length; i++) {
        this.producto[i] = data[i].nombreProducto;
      }
    });
    this.configurar.obtenerDatosProveedores().subscribe((data) => {
      this.listaDeProveedores = data;
      
    });
    this.configurar.obtenerRegistro().subscribe((data) => {
      this.registro = data;
    });
  }

  recuperarId(pOM: number) {
    let seleccion;
    let objetivo;

    if (pOM == 1) {
      seleccion = this.formulario.get('formProducto')?.value;
      objetivo = this.ingresoProducto.get('formNuevoProducto');
    
    } else {
      seleccion = this.formulario.get('formMarca')?.value;
      objetivo = this.ingresoMarca.get('formNuevaMarca');

    }
    if (seleccion == '' || seleccion == null) {
      this.campoVacio = true;
    } else {
      switch(pOM){
        case 1:{
          for (let i = 0; i < this.listaDeProductos.length; i++) {
            if (this.listaDeProductos[i].nombreProducto == seleccion) {
              this.id = this.listaDeProductos[i].id;
              this.campoVacio = false;
            }
          }
          objetivo?.setValue(seleccion);
          this.cacheDeEdicion=seleccion;
         
          break;
        }
        case 2:{
          for (let i = 0; i < this.listaDeMarcas.length; i++) {
            if (this.listaDeMarcas[i].nombreMarca == seleccion) {
              this.id = this.listaDeMarcas[i].id;
              this.campoVacio = false;
            }
          }
          objetivo?.setValue(seleccion);
          this.cacheDeEdicion=seleccion;
          
          break;
        }
      }
    }
  }

  editarProductoOMarca(pOM: number) {
    let seleccion:string;
    let lista;
    let valorRepetido: boolean = false;
    let objeto: any;
    let idMarca:number;

    if (pOM == 1) {
      seleccion = this.ingresoProducto.get('formNuevoProducto')?.value;
      objeto = new Producto(this.id, seleccion);
      lista = this.producto;
    } else {
      seleccion = this.ingresoMarca.get('formNuevaMarca')?.value;
      objeto = new Marca(this.id, seleccion);
      lista = this.marca;
    }

    //1 verifica que el dato guardado en seleccion no se encuentre en la lista correspondiente a modificar (producto o marca)
    for (let i = 0; i < lista.length; i++) {
      if (lista[i] == seleccion) {
        alert(
          'Atencion: el campo contiene una etiqueta que ya se encuentra en la lista. Por favor pruebe nuevamente con otro nombre.'
        );
        valorRepetido = true;
        break;
      } else {
        valorRepetido = false;
      }
    }

    //2 Si no se encuentra: a) primero modifica la lista desplegable
    if (valorRepetido == false && seleccion != '' && seleccion != null) {
      switch (pOM) {
        case 1: {
          this.configurar.editarDatosProducto(this.id, objeto).subscribe({
            next: (data) => {
              this.ingresoProducto.get('formNuevoProducto')?.setValue('');
              this.formulario.get('formProducto')?.setValue('');
              document.getElementById('cerrarModalNuevoProducto')?.click();
              alert('Dato actualizado correctamente');
              this.ngOnInit();
            },
            error: (error) => {
              alert(
                'Error al intentar editar la etiqueta. Por favor intente nuevamente'
              );
            },
          });
          break;
        }
        case 2: {
          for(let item of this.registro){
              if(item.marcaProducto == this.cacheDeEdicion){
                idMarca = item.id;
                let nuevoRegistroEditado = new Registro(idMarca,item.nombreProducto,item.codigoProducto,seleccion,item.barrasProducto,item.imagenProducto);
                        this.configurar.editarRegistro(idMarca,nuevoRegistroEditado).subscribe({
                          next: (data)=> {
                      },
                      error: (error) => {
                        alert(
                          'Error al intentar editar la etiqueta(REG). Por favor intente nuevamente'
                        );
                      },
                    });
                  }
              }
          this.configurar.editarDatosMarca(this.id, objeto).subscribe({
            next: (data) => {},
            error: (error) => {
              alert(
                'Error al intentar editar la etiqueta(DM). Por favor intente nuevamente'
              );
            },
            });
          this.ngOnInit();
          document.getElementById('cerrarModalNuevaMarca')?.click();
                        alert('Dato actualizado correctamente');
                        this.ingresoMarca.get('formNuevaMarca')?.setValue('');
                        this.formulario.get('formMarca')?.setValue('');
          this.obtenerDatosSeleccion(this.id);
          break;
        }
      }
      this.id = 0;
    }
    
  }

  borrarProductoOMarca(pOM: number) {
    switch (pOM) {
      case 1: {
        if (this.ingresoProducto.valid && this.id != 0) {
          this.configurar.borrarProducto(this.id).subscribe({
            next: (data) => {
              alert('Producto Eliminado Correctamente');
              this.ngOnInit();
              this.ingresoProducto.reset();
              this.formulario.get('formProducto')?.setValue('');
              document.getElementById('cerrarModalNuevoProducto')?.click();
            },
            error: (error) => {
              alert(
                'Error al intentar borrar el Producto. Por favor intente nuevamente'
              );
            },
          });
        }
        break;
      }
      case 2:
        {
          if (this.ingresoMarca.valid && this.id != 0) {
            this.configurar.borrarMarca(this.id).subscribe({
              next: (data) => {
                alert('Marca Eliminada Correctamente');
                this.ngOnInit();
                this.ingresoMarca.reset();
                this.formulario.get('formMarca')?.setValue('');
                document.getElementById('cerrarModalNuevaMarca')?.click();
              },
              error: (error) => {
                alert(
                  'Error al intentar borrar la Marca. Por favor intente nuevamente'
                );
              },
            });
          }
          break;
        }
        this.id = 0;
    }
  }

  obtenerDatosSeleccion(id: number) {
    this.id = id;
    for (let item of this.registro) {
      if (item.id == id) {
        this.formulario.get('formProducto')?.setValue(item.nombreProducto);
        this.formulario.get('formCodProd')?.setValue(item.codigoProducto);
        this.formulario.get('formMarca')?.setValue(item.marcaProducto);
        this.formulario.get('formCodBarras')?.setValue(item.barrasProducto);
        //this.formulario.get('formImagen')?.setValue(item.imagenProducto);
      }
    }
  }

  generarCodigoDeBarras() {
    let codProd = this.formulario.get('formCodProd')?.value;
    if (codProd == '' || codProd == null) {
      this.campoVacio = true;
    } else {
      this.campoVacio = false;
      this.urlCodBarras =
        'https://barcode.tec-it.com/barcode.ashx?data=' +
        codProd +
        '&code=Code128&translate-esc=on';
    }
  }

  abrirColapsable(id: number) {
    switch (id) {
      case 1: {
        this.collapseProducto = true;
        this.collapseProveedor = false;
        this.collapseGastos = false;
        this.proveedores.reset();
        this.id = 0;
        this.ngOnInit();
        break;
      }
      case 2: {
        this.collapseProducto = false;
        this.collapseProveedor = true;
        this.collapseGastos = false;
        this.formulario.reset();
        this.formulario.get('formProducto')?.setValue('');
        this.formulario.get('formMarca')?.setValue('');
        this.id = 0;
        this.ngOnInit();
        break;
      }
      /*case 3:{
    this.collapseProducto=false;
    this.collapseProveedor=false;
    this.collapseGastos=true;
    this.formulario.get('formProducto')?.setValue("");
    this.formulario.get('formMarca')?.setValue("");
    this.formulario.get('formProveedor')?.setValue("");
    this.ngOnInit();
    break;
  }*/
    }
  }

  imprimirCodigoDeProducto(codigo: string) {
    let mywindow = window.open('', 'PRINT', 'height=600,width=600');
    mywindow?.document.write('<html><head>');
    mywindow?.document.write('<meta charset="UTF-8">');
    mywindow?.document.write(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
    mywindow?.document.write('<style>img{margin-right:1rem}</style>');
    mywindow?.document.write('</head><body>');
    for (let i = 0; i < 45; i++) {
      mywindow?.document.write(
        '<img height=100px; width:114px; src=' + codigo + 'onload="print()"/>'
      );
    }
    mywindow?.document.write('</body></html>');
    mywindow?.document.close();
    mywindow?.focus();
    setTimeout( () => {
      mywindow?.print();
      mywindow?.close();
 }, 300);
    document.getElementById('cerrarModalCodigoDeBarras')?.click();
    return true;
  }

  iniciarScanner(){
    const myModal = document.getElementById('codeBar');
    const myInput = document.getElementById('hiddenCodeBar');

   myModal?.addEventListener('shown.bs.modal', () => {
    myInput?.focus()})

  }

  leerScanner(){
    let codigo = this.lecturaCodeBar.get('formCodeBar')?.value;
    if(codigo!="" || codigo!=null){
      document.getElementById('btnCerrarBarCode')?.click();
      this.formulario.get('formCodBarras')?.setValue(codigo);
      this.lecturaCodeBar.get('formCodeBar')?.setValue("");
    for(let item of this.registro){
      if (item.barrasProducto == codigo){
        this.formulario.get('formProducto')?.setValue(item.nombreProducto);
        this.formulario.get('formMarca')?.setValue(item.marcaProducto);
      }
    }
    }
  }

  guardarCodigoDeProducto() {
    this.urlCodBarras += '&imageType=Jpg&download=true';
    document.getElementById('cerrarModalCodigoDeBarras')?.click();
  }

  borrarRegistroSeleccionado() {
    if (this.formulario.valid && this.id != 0) {
      this.configurar.borrarRegistro(this.id).subscribe({
        next: (data) => {
          alert('Registro Eliminado Correctamente');
          this.ngOnInit();
          this.formulario.reset();
        },
        error: (error) => {
          alert('Error al borrar el Registro. Por favor intente nuevamente');
        },
      });
      document.getElementById('cerrarModalEliminar')?.click();
    }
    this.id = 0;
  }

  editarRegistroSeleccionado() {
    if (this.formulario.valid) {
      let valorRepetido: boolean = false;
      let producto = this.formulario.get('formProducto')?.value;
      let codigoDelProducto = this.formulario.get('formCodProd')?.value;
      let marca = this.formulario.get('formMarca')?.value;
      let codigoDeBarrasDelProducto = this.formulario.get('formCodBarras')?.value;
        this.formulario.get('formCodBarras')?.value;
      let imagen = this.formulario.get('formImagen')?.value;
      for (let item of this.registro) {
        if (
          item.barrasProducto == codigoDeBarrasDelProducto &&
          item.codigoProducto == codigoDelProducto &&
          item.id != this.id
          
        ) {
          valorRepetido = true;
          alert(
            'Atencion: Esta duplicando un registro ya existente. Por favor verifique y vuelva a intentar.'
          );
        }
      }
      if (valorRepetido == false) {
        let registroEditado = new Registro(
          this.id,
          producto,
          codigoDelProducto,
          marca,
          codigoDeBarrasDelProducto,
          imagen
        );
        this.configurar.editarRegistro(this.id, registroEditado).subscribe({
          next: (data) => {
            alert('Registro Actualizado Correctamente');
            this.ngOnInit();
            this.formulario.reset();
          },
          error: (error) => {
            alert(
              'Error al intentar actualizar el registro. Por favor intente nuevamente'
            );
          },
        });
      }
      //this.id = 0;
    } else {
      this.formulario.markAllAsTouched();
      alert('Atencion! uno o mas campos requeridos no han sido completados!!');
    }
  }

  agregarAlListado() {
    if (this.formulario.valid) {
      let valorRepetido: boolean = false;
      let idNuevoProducto = 0;
      let producto = this.formulario.get('formProducto')?.value;
      let codigoDelProducto = this.formulario.get('formCodProd')?.value;
      let marca = this.formulario.get('formMarca')?.value;
      let codigoDeBarrasDelProducto =
        this.formulario.get('formCodBarras')?.value;
        let imagen = this.formulario.get('formImagen')?.value;
        if(imagen!=null && imagen!=""){
          imagen="";
          imagen = './assets/imagenes/'+this.formulario.get('formImagen')?.value.substring(12);
        }else{
          imagen="/assets/imagenes/sinImagen.png";
        }
     
      for (let item of this.registro) {
        if (
          item.barrasProducto == codigoDeBarrasDelProducto &&
          item.codigoProducto == codigoDelProducto
        ) {
          valorRepetido = true;
          alert('INGRESO REPETIDO');
          this.formulario.reset();
        }
      }
      if (valorRepetido == false) {
        let nuevoRegistro = new Registro(
          idNuevoProducto,
          producto,
          codigoDelProducto,
          marca,
          codigoDeBarrasDelProducto,
          imagen
        );
        this.configurar.agregarRegistro(nuevoRegistro).subscribe({
          next: (data) => {
            this.formulario.reset();
            this.ngOnInit();
          },
          error: (error) => {
            alert(
              'Error al intentar actualizar el listado. Por favor intente nuevamente'
            );
          },
        });
      }
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  resetearModal(modal: any, valor: number) {
    modal.reset();
    this.id = 0;
    if (valor == 1) {
      modal.get('formProducto')?.setValue('');
      modal.get('formMarca')?.setValue('');
    }
  }

  ingresarNuevoProducto() {
    let valorRepetido: boolean = false;
    let nuevoProducto = this.ingresoProducto.get('formNuevoProducto')?.value;
    let idNuevoProducto = 0;
    if (nuevoProducto != '' && nuevoProducto != null) {
      for (let item of this.producto) {
        if (item == nuevoProducto) {
          valorRepetido = true;
          alert('VALOR REPETIDO!!!'); //Cambiar por algo mas estetico.
          this.ingresoProducto.reset();
        }
      }
      if (valorRepetido == false) {
        let nuevoItemProducto = new Producto(idNuevoProducto, nuevoProducto);
        this.configurar.agregarDatosProducto(nuevoItemProducto).subscribe({
          next: (data) => {
            this.ingresoProducto.reset();
            document.getElementById('cerrarModalNuevoProducto')?.click();
            this.ngOnInit();
          },
          error: (error) => {
            alert(
              'Error al intentar registrar el producto. Por favor intente nuevamente'
            );
          },
        });
      }
    } else {
      this.ingresoProducto.markAllAsTouched();
    }
  }

  ingresarNuevaMarca() {
    let valorRepetido: boolean = false;
    let nuevaMarca = this.ingresoMarca.get('formNuevaMarca')?.value;
    let idNuevaMarca = 0;
    if (nuevaMarca != '' && nuevaMarca != null) {
      for (let item of this.marca) {
        if (item == nuevaMarca) {
          valorRepetido = true;
          alert('VALOR REPETIDO!!!'); //Cambiar por algo mas estetico.
          this.ingresoMarca.reset();
        }
      }
      if (valorRepetido == false) {
        let nuevoItemMarca = new Marca(idNuevaMarca, nuevaMarca);
        this.configurar.agregarDatosMarca(nuevoItemMarca).subscribe({
          next: (data) => {
            this.ingresoMarca.reset();
            document.getElementById('cerrarModalNuevaMarca')?.click();
            this.ngOnInit();
          },
          error: (error) => {
            alert(
              'Error al intentar registrar la marca. Por favor intente nuevamente'
            );
          },
        });
      }
    } else {
      this.ingresoMarca.markAllAsTouched();
    }
  }

  ingresarNuevoProveedor() {
    let valorRepetido: boolean = false;
    let nuevoProveedor;
    let nuevoProveedorTelefono;
    let nuevoProveedorEmail;
    if (this.collapseProducto) {
      nuevoProveedor = this.ingresoProveedor.get('formNuevoProveedor')?.value;
    } else {
      nuevoProveedor = this.proveedores.get('formProveedor')?.value;
      nuevoProveedorTelefono = this.proveedores.get('formTelefono')?.value;
      nuevoProveedorEmail = this.proveedores.get('formEmail')?.value;
    }
    let idNuevoProveedor = 0;
    if (nuevoProveedor != '' && nuevoProveedor != null) {
      for (let item of this.listaDeProveedores.nombreProveedor) {
        if (item == nuevoProveedor) {
          valorRepetido = true;
          alert('VALOR REPETIDO!!!'); //Cambiar por algo mas estetico.
          this.ingresoProveedor.reset();
        }
      }
      if (valorRepetido == false) {
        let nuevoItemProveedor;
          nuevoItemProveedor = new Proveedor(
            idNuevoProveedor,
            nuevoProveedor,
            nuevoProveedorTelefono,
            nuevoProveedorEmail
          );
        
        this.configurar.agregarDatosProveedor(nuevoItemProveedor).subscribe({
          next: (data) => {
            this.ingresoProveedor.reset();
            document.getElementById('cerrarModalNuevoProveedor')?.click();
            this.ngOnInit();
          },
          error: (error) => {
            alert(
              'Error al intentar registrar el proveedor. Por favor intente nuevamente'
            );
          },
        });
      }
    } else {
      this.ingresoProveedor.markAllAsTouched();
    }
  }

  recuperarProveedor(id: number) {
    this.id = id;
    for (let item of this.listaDeProveedores) {
      if (item.id == id) {
        this.proveedores.get('formProveedor')?.setValue(item.nombreProveedor);
        this.proveedores.get('formTelefono')?.setValue(item.telefonoProveedor);
        this.proveedores.get('formEmail')?.setValue(item.emailProveedor);
      }
    }
  }

  editarProveedor() {
    if (this.proveedores.valid) {
      let proveedor = this.proveedores.get('formProveedor')?.value;
      let telefono = this.proveedores.get('formTelefono')?.value;
      let email = this.proveedores.get('formEmail')?.value;

      let proveedorEditado = new Proveedor(this.id, proveedor, telefono, email);
      this.configurar
        .editarDatosProveedor(this.id, proveedorEditado)
        .subscribe({
          next: (data) => {
            alert('Datos Actualizados Correctamente');
            this.ngOnInit();
            this.proveedores.reset();
          },
          error: (error) => {
            alert(
              'Error al intentar actualizar los datos. Por favor intente nuevamente'
            );
          },
        });
      this.id = 0;
    } else {
      this.proveedores.markAllAsTouched();
      alert('Atencion! uno o mas campos requeridos no han sido completados!!');
    }
  }

  borrarProveedor() {
    if (this.id != 0) {
      this.configurar.borrarProveedor(this.id).subscribe({
        next: (data) => {
          alert('Proveedor Eliminado Correctamente');
          this.ngOnInit();
          this.proveedores.reset();
        },
        error: (error) => {
          alert(
            'Error al intentar borrar la seleccion. Por favor intente nuevamente'
          );
        },
      });
    }
    this.id = 0;
  }
}
