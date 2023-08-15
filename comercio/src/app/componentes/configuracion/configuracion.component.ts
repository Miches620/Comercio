import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/servicios/admin.service';
import { Producto } from 'src/app/entidades/producto';
import { Proveedor } from 'src/app/entidades/proveedor';
import { Marca } from 'src/app/entidades/marca';
import { Registro } from 'src/app/entidades/registro';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEmpty } from 'rxjs';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.component.html',
  styleUrls: ['./configuracion.component.css'],
})
export class ConfiguracionComponent implements OnInit {
  marca: any = [];
  producto: any = [];
  proveedor: any = [];
  listaDeProveedores: any = [];
  formulario: FormGroup;
  proveedores: FormGroup;
  collapseProducto: boolean = false;
  collapseProveedor: boolean = true;
  collapseGastos: boolean = false;
  ingresoProducto: FormGroup;
  ingresoMarca: FormGroup;
  ingresoProveedor: FormGroup;
  registro: any;
  urlCodBarras: string = '';
  campoVacio: boolean = true;
  id: number = 0;

  constructor(
    private configurar: AdminService,
    private servicioFormulario: FormBuilder
  ) {
    this.formulario = this.servicioFormulario.group({
      formProducto: ['', Validators.required],
      formCodProd: ['', Validators.required],
      formMarca: [''],
      formProveedor: [''],
      formCosto: ['', Validators.required],
      formGanancia: ['', Validators.required],
      formCodBarras: [''],
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
      for (let i = 0; i < data.length; i++) {
        this.marca[i] = data[i].nombreMarca;
      }
    });
    this.configurar.obtenerDatosProductos().subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        this.producto[i] = data[i].nombreProducto;
      }
    });
    this.configurar.obtenerDatosProveedores().subscribe((data) => {
      this.listaDeProveedores = data;
      for (let i = 0; i < data.length; i++) {
        this.proveedor[i] = data[i].nombreProveedor;
      }
    });
    this.configurar.obtenerRegistro().subscribe((data) => {
      this.registro = data;
    });
  }

  obtenerDatosSeleccion(id: number) {
    this.id = id;
    for (let item of this.registro) {
      if (item.id == id) {
        this.formulario.get('formProducto')?.setValue(item.nombreProducto);
        this.formulario.get('formCodProd')?.setValue(item.codigoProducto);
        this.formulario.get('formMarca')?.setValue(item.marcaProducto);
        this.formulario.get('formProveedor')?.setValue(item.proveedorProducto);
        this.formulario.get('formCosto')?.setValue(item.costoProducto);
        this.formulario.get('formGanancia')?.setValue(item.gananciaProducto);
        this.formulario.get('formCodBarras')?.setValue(item.barrasProducto);
        this.formulario.get('formImagen')?.setValue(item.imagenProducto);

        /*this.urlCodBarras =
        'https://barcode.tec-it.com/barcode.ashx?data=' +
        item.codigoProducto +
        '&code=Code128&translate-esc=on';*/
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
        this.formulario.get('formProveedor')?.setValue('');
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
    document.getElementById('cerrarModalCodigoDeBarras')?.click();
    let mywindow = window.open('', 'PRINT', 'height=400,width=600');
    mywindow?.document.write('<html><head>');
    mywindow?.document.write('<meta charset="UTF-8">');
    mywindow?.document.write(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    );
    mywindow?.document.write('<style>img{margin-right:1rem}</style>');
    mywindow?.document.write('</head><body>');
    for (let i = 0; i < 45; i++) {
      mywindow?.document.write(
        '<img height=100px; width:114px; src=' + codigo + '/>'
      );
    }
    mywindow?.document.write('</body></html>');
    mywindow?.document.close();
    mywindow?.focus();
    mywindow?.print();
    mywindow?.close();
    document.getElementById('cerrarModalCodigoDeBarras')?.click();
    return true;
  }

  guardarCodigoDeProducto() {
    this.urlCodBarras += '&imageType=Jpg&download=true';
    document.getElementById('cerrarModalCodigoDeBarras')?.click();
  }

  borrarRegistroSeleccionado() {
    if (this.id != 0) {
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
    }
    this.id = 0;
  }

  editarRegistroSeleccionado() {
    if (this.formulario.valid) {
      let producto = this.formulario.get('formProducto')?.value;
      let codigoDelProducto = this.formulario.get('formCodProd')?.value;
      let marca = this.formulario.get('formMarca')?.value;
      let proveedor = this.formulario.get('formProveedor')?.value;
      let costo = this.formulario.get('formCosto')?.value;
      let ganancia = this.formulario.get('formGanancia')?.value;
      let codigoDeBarrasDelProducto =
        this.formulario.get('formCodBarras')?.value;
      let imagen = this.formulario.get('formImagen')?.value;
      let registroEditado = new Registro(
        this.id,
        producto,
        codigoDelProducto,
        marca,
        proveedor,
        costo,
        ganancia,
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
      this.id = 0;
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
      let proveedor = this.formulario.get('formProveedor')?.value;
      let costo = this.formulario.get('formCosto')?.value;
      let ganancia = this.formulario.get('formGanancia')?.value;
      let codigoDeBarrasDelProducto =
        this.formulario.get('formCodBarras')?.value;
      let imagen = this.formulario.get('formImagen')?.value;

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
          proveedor,
          costo,
          ganancia,
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

  resetearModal(modal:any,valor:number) {
    modal.reset();
    this.id = 0;
    if (valor == 1) {
      modal.get('formProducto')?.setValue('');
      modal.get('formMarca')?.setValue('');
      modal.get('formProveedor')?.setValue('');
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
      for (let item of this.proveedor) {
        if (item == nuevoProveedor) {
          valorRepetido = true;
          alert('VALOR REPETIDO!!!'); //Cambiar por algo mas estetico.
          this.ingresoProveedor.reset();
        }
      }
      if (valorRepetido == false) {
        let nuevoItemProveedor;
        if (this.collapseProducto) {
          nuevoItemProveedor = new Proveedor(
            idNuevoProveedor,
            nuevoProveedor,
            '',
            ''
          );
        } else {
          nuevoItemProveedor = new Proveedor(
            idNuevoProveedor,
            nuevoProveedor,
            nuevoProveedorTelefono,
            nuevoProveedorEmail
          );
        }
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
