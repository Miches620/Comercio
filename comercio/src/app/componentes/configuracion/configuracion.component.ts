import { Component, OnInit } from "@angular/core";
import { AdminService } from "src/app/servicios/admin.service";
import {Producto as ProductoInterface} from "src/app/entidades/interfaces/producto";
import {Proveedor as ProveedorInterface} from "src/app/entidades/interfaces/proveedor";
import {Marca as MarcaInterface} from "src/app/entidades/interfaces/marca";
import {Registro as RegistroInterface} from "src/app/entidades/interfaces/registro";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-configuracion",
  templateUrl: "./configuracion.component.html",
  styleUrls: ["./configuracion.component.css"],
})
export class ConfiguracionComponent implements OnInit {
  marca: string[] = [];
  producto: string[] = [];

  listaDeProductos: ProductoInterface[]=[];
  listaDeProveedores: ProveedorInterface[]=[];
  listaDeMarcas:MarcaInterface[]=[];
  registro: RegistroInterface[]=[];

  formulario: FormGroup;
  proveedores: FormGroup;
  ingresoProducto: FormGroup;
  ingresoMarca: FormGroup;
  ingresoProveedor: FormGroup;
  lecturaCodeBar:FormGroup;

  collapseProducto: boolean = false;
  collapseProveedor: boolean = true;
  collapseGastos: boolean = false;
  
  urlCodBarras: string = "";
  campoVacio: boolean = true;
  id: number = 0;
  cacheDeEdicion:string="";

  constructor(
    private configurar: AdminService,
    private servicioFormulario: FormBuilder
  ) {
    this.formulario = this.servicioFormulario.group({
      formProducto: ["", Validators.required],
      formCodProd: ["", Validators.required],
      formMarca: ["", Validators.required],
      formCodBarras: ["", Validators.required],
      formImagen: [""],
    });
    this.proveedores = this.servicioFormulario.group({
      formProveedor: ["", Validators.required],
      formTelefono: ["", Validators.minLength(10)],
      formEmail: [
        "",
        Validators.pattern(
          "[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-]([.]?[a-zA-Z0-9!#$%&'*/=?^_`{|}~+-])+@[a-zA-Z0-9]([^@&%$/()=?¿!.,:;]|d)+[a-zA-Z0-9][.][a-zA-Z]{2,4}([.][a-zA-Z]{2})?"
        ),
      ],
    });
    this.ingresoProducto = this.servicioFormulario.group({
      formNuevoProducto: ["", Validators.required],
    });
    this.ingresoMarca = this.servicioFormulario.group({
      formNuevaMarca: ["", Validators.required],
    });
    this.ingresoProveedor = this.servicioFormulario.group({
      formNuevoProveedor: ["", Validators.required],
    });
    this.lecturaCodeBar = this.servicioFormulario.group({
      formCodeBar:[""],
    });
  }

  get nuevoProducto() {
    return this.ingresoProducto.get("formNuevoProducto");
  }

  get nuevaMarca() {
    return this.ingresoMarca.get("formNuevaMarca");
  }

  get nuevoProveedor() {
    return this.ingresoProveedor.get("formNuevoProveedor");
  }

  ngOnInit(): void {
    this.configurar.obtenerDatosMarcas().subscribe(data => {
      this.listaDeMarcas=data;
      for (let i = 0; i < data.length; i++) {
        this.marca = data.map(marca => marca.nombreMarca);
      }
    });
    this.configurar.obtenerDatosProductos().subscribe((data) => {
      this.listaDeProductos=data;
      for (let i = 0; i < data.length; i++) {
        this.producto = data.map(producto => producto.nombreProducto);
      }
    });
    this.configurar.obtenerDatosProveedores().subscribe((data) => {
      this.listaDeProveedores = data;
      
    });
    this.configurar.obtenerRegistro().subscribe((data) => {
      this.registro = data;
    });
  }

  recuperarId(productoOMarca: number) {
    let seleccion;
    let objetivo;

    if (productoOMarca == 1) {
      seleccion = this.formulario.get("formProducto")?.value;
      objetivo = this.ingresoProducto.get("formNuevoProducto");
    
    } else {
      seleccion = this.formulario.get("formMarca")?.value;
      objetivo = this.ingresoMarca.get("formNuevaMarca");

    }
    if (seleccion == "" || seleccion == null) {
      this.campoVacio = true;
    } else {
      switch(productoOMarca){
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

  editarProductoOMarca(productoOMarca: number) {
    let seleccion:string;
    let lista;
    let nuevoProducto: ProductoInterface | undefined = undefined;
    let nuevaMarca: MarcaInterface | undefined = undefined;
    let atributo:string="";

    if (productoOMarca == 1) {
      seleccion = this.ingresoProducto.get("formNuevoProducto")?.value;
      nuevoProducto = {id:this.id,nombreProducto:seleccion};
      lista = this.producto;
    } else {
      seleccion = this.ingresoMarca.get("formNuevaMarca")?.value;
      nuevaMarca = {id:this.id, nombreMarca:seleccion};
      lista = this.marca;
    }

    //1 verifica que el dato guardado en seleccion no se encuentre en la lista correspondiente a modificar (producto o marca)
 
    const valorRepetido = lista.find(item => item===seleccion);
    if(valorRepetido){
      alert(
        "Atencion: el campo contiene una etiqueta que ya se encuentra en la lista. Por favor pruebe nuevamente con otro nombre."
      );
    }

    //2 Si no se encuentra: a) primero modifica la lista desplegable
    if (!valorRepetido  && seleccion != "" && seleccion != null) {
      switch (productoOMarca) {
      case 1: {
        if(nuevoProducto!=undefined){
          this.configurar.editarDatosProducto(this.id,nuevoProducto).subscribe({
            next: () => {
              this.ingresoProducto.get("formNuevoProducto")?.setValue("");
              this.formulario.get("formProducto")?.setValue("");
              document.getElementById("cerrarModalNuevoProducto")?.click();
              alert("Producto actualizado correctamente");
            },
            error: (e) => {
              alert(
                "Error al intentar editar la etiqueta Producto. Por favor intente nuevamente. " +e
              );
            },
          });
          atributo="nombreProducto=";
          this.configurar.editarMultiplesRegistros(atributo,this.cacheDeEdicion,seleccion);
        }
        break;
      }
      case 2: {
   
        if(nuevaMarca!=undefined){
          this.configurar.editarDatosMarca(this.id,nuevaMarca).subscribe({
            next: () => {
              this.ingresoMarca.get("formNuevaMarca")?.setValue("");
              this.formulario.get("formMarca")?.setValue("");
              document.getElementById("cerrarModalNuevaMarca")?.click();
              alert("Marca actualizada correctamente");
            },
            error: (e) => {
              alert(
                "Error al intentar editar la etiqueta Marca. Por favor intente nuevamente."+e
              );
            },
          });
          atributo="marcaProducto=";
          this.configurar.editarMultiplesRegistros(atributo,this.cacheDeEdicion,seleccion);
        }
        break;
      }
      }
      this.id = 0;
      
    }
    this.ngOnInit();
  }

  borrarProductoOMarca(productoOMarca: number) {
    switch (productoOMarca) {
    case 1: {
      if (this.ingresoProducto.valid && this.id != 0) {
        this.configurar.borrarProducto(this.id).subscribe({
          next: () => {
            alert("Producto Eliminado Correctamente");
            this.ngOnInit();
            this.ingresoProducto.reset();
            this.formulario.get("formProducto")?.setValue("");
            document.getElementById("cerrarModalNuevoProducto")?.click();
          },
          error: (e) => {
            alert(
              "Error al intentar borrar el Producto. Por favor intente nuevamente. "+e
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
            next: () => {
              alert("Marca Eliminada Correctamente");
              this.ngOnInit();
              this.ingresoMarca.reset();
              this.formulario.get("formMarca")?.setValue("");
              document.getElementById("cerrarModalNuevaMarca")?.click();
            },
            error: (e) => {
              alert(
                "Error al intentar borrar la Marca. Por favor intente nuevamente. "+e
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
    for (const item of this.registro) {
      if (item.id == id) {
        this.formulario.get("formProducto")?.setValue(item.nombreProducto);
        this.formulario.get("formCodProd")?.setValue(item.codigoProducto);
        this.formulario.get("formMarca")?.setValue(item.marcaProducto);
        this.formulario.get("formCodBarras")?.setValue(item.barrasProducto);
        //this.formulario.get('formImagen')?.setValue(item.getimagenProducto);
      }
    }
  }

  generarCodigoDeBarras() {
    const codProd = this.formulario.get("formCodProd")?.value;
    if (codProd == "" || codProd == null) {
      this.campoVacio = true;
    } else {
      this.campoVacio = false;
      this.urlCodBarras =
        "https://barcode.tec-it.com/barcode.ashx?data=" +
        codProd +
        "&code=Code128&translate-esc=on";
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
      this.formulario.get("formProducto")?.setValue("");
      this.formulario.get("formMarca")?.setValue("");
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
    const mywindow = window.open("", "PRINT", "height=600,width=600");
    mywindow?.document.write("<html><head>");
    mywindow?.document.write("<meta charset=\"UTF-8\">");
    mywindow?.document.write(
      "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">"
    );
    mywindow?.document.write("<style>img{margin-right:1rem}</style>");
    mywindow?.document.write("</head><body>");
    for (let i = 0; i < 45; i++) {
      mywindow?.document.write(
        "<img height=100px; width:114px; src=" + codigo + "onload=\"print()\"/>"
      );
    }
    mywindow?.document.write("</body></html>");
    mywindow?.document.close();
    mywindow?.focus();
    setTimeout( () => {
      mywindow?.print();
      mywindow?.close();
    }, 300);
    document.getElementById("cerrarModalCodigoDeBarras")?.click();
    return true;
  }

  iniciarScanner(){
    const myModal = document.getElementById("codeBar");
    const myInput = document.getElementById("hiddenCodeBar");

    myModal?.addEventListener("shown.bs.modal", () => {
      myInput?.focus();});

  }

  leerScanner(){
    const codigo = this.lecturaCodeBar.get("formCodeBar")?.value;
    if(codigo!="" || codigo!=null){
      document.getElementById("btnCerrarBarCode")?.click();
      this.formulario.get("formCodBarras")?.setValue(codigo);
      this.lecturaCodeBar.get("formCodeBar")?.setValue("");
      for(const item of this.registro){
        if (item.barrasProducto == codigo){
          this.formulario.get("formProducto")?.setValue(item.nombreProducto);
          this.formulario.get("formMarca")?.setValue(item.marcaProducto);
        }
      }
    }
  }

  guardarCodigoDeProducto() {
    this.urlCodBarras += "&imageType=Jpg&download=true";
    document.getElementById("cerrarModalCodigoDeBarras")?.click();
  }

  borrarRegistroSeleccionado() {
    if (this.formulario.valid && this.id != 0) {
      this.configurar.borrarRegistro(this.id).subscribe({
        next: () => {
          alert("Registro Eliminado Correctamente");
          this.ngOnInit();
          this.formulario.reset();
        },
        error: (e) => {
          alert("Error al borrar el Registro. Por favor intente nuevamente. "+e);
        },
      });
      document.getElementById("cerrarModalEliminar")?.click();
    }
    this.id = 0;
  }

  editarRegistroSeleccionado() {
    if (this.formulario.valid) {
      let valorRepetido: boolean = false;
      const producto:string = this.formulario.get("formProducto")?.value;
      const codigoDelProducto:string = this.formulario.get("formCodProd")?.value;
      const marca:string = this.formulario.get("formMarca")?.value;
      const codigoDeBarrasDelProducto:string = this.formulario.get("formCodBarras")?.value;
      const idRegistro=this.id;
      let registroEditado:RegistroInterface | undefined=undefined;
      this.formulario.get("formCodBarras")?.value;
      const imagen = this.formulario.get("formImagen")?.value;
      for (const item of this.registro) {
        if (
          item.barrasProducto == codigoDeBarrasDelProducto &&
          item.codigoProducto == codigoDelProducto &&
          item.id != this.id
          
        ) {
          valorRepetido = true;
          alert(
            "Atencion: Esta duplicando un registro ya existente. Por favor verifique y vuelva a intentar."
          );
        }
      }
      if (valorRepetido == false) {
        registroEditado={
          id:idRegistro,
          nombreProducto:producto,
          codigoProducto:codigoDelProducto,
          marcaProducto:marca,
          barrasProducto:codigoDeBarrasDelProducto,
          imagenProducto:imagen
        };
        this.configurar.editarRegistro(this.id, registroEditado).subscribe({
          next: () => {
            alert("Registro Actualizado Correctamente");
            this.ngOnInit();
            this.formulario.reset();
          },
          error: (e) => {
            alert(
              "Error al intentar actualizar el registro. Por favor intente nuevamente. "+e
            );
          },
        });
      }
      //this.id = 0;
    } else {
      this.formulario.markAllAsTouched();
      alert("Atencion! uno o mas campos requeridos no han sido completados!!");
    }
  }

  agregarAlListado() {
    if (this.formulario.valid) {
      let valorRepetido: boolean = false;
      const idNuevoProducto = 0;
      const producto = this.formulario.get("formProducto")?.value;
      const codigoDelProducto = this.formulario.get("formCodProd")?.value;
      const marca = this.formulario.get("formMarca")?.value;
      const codigoDeBarrasDelProducto =
        this.formulario.get("formCodBarras")?.value;
      let imagen = this.formulario.get("formImagen")?.value;
      if(imagen!=null && imagen!=""){
        imagen="";
        imagen = "./assets/imagenes/"+this.formulario.get("formImagen")?.value.substring(12);
      }else{
        imagen="/assets/imagenes/sinImagen.png";
      }
      let nuevoRegistro:RegistroInterface | undefined=undefined;
     
      for (const item of this.registro) {
        if (
          item.barrasProducto == codigoDeBarrasDelProducto &&
          item.codigoProducto == codigoDelProducto
        ) {
          valorRepetido = true;
          alert("INGRESO REPETIDO");
          this.formulario.reset();
        }
      }
      if (valorRepetido == false) {
        nuevoRegistro = {
          id:idNuevoProducto,
          nombreProducto:producto,
          codigoProducto:codigoDelProducto,
          marcaProducto:marca,
          barrasProducto:codigoDeBarrasDelProducto,
          imagenProducto:imagen
        };
        this.configurar.agregarRegistro(nuevoRegistro).subscribe({
          next: () => {
            this.formulario.reset();
            this.ngOnInit();
          },
          error: (e) => {
            alert(
              "Error al intentar actualizar el listado. Por favor intente nuevamente. "+e
            );
          },
        });
      }
    } else {
      this.formulario.markAllAsTouched();
    }
  }

  resetearModal(modal: FormGroup, valor: number) {
    modal.reset();
    this.id = 0;
    if (valor == 1) {
      modal.get("formProducto")?.setValue("");
      modal.get("formMarca")?.setValue("");
    }
  }

  ingresarNuevoProducto() {
    let valorRepetido: boolean = false;
    const nuevoProducto = this.ingresoProducto.get("formNuevoProducto")?.value;
    const idNuevoProducto = 0;
    let nuevoItemProducto:ProductoInterface | undefined=undefined;
    if (nuevoProducto != "" && nuevoProducto != null) {
      for (const item of this.producto) {
        if (item == nuevoProducto) {
          valorRepetido = true;
          alert("VALOR REPETIDO!!!"); //Cambiar por algo mas estetico.
          this.ingresoProducto.reset();
        }
      }
      if (valorRepetido == false) {
        nuevoItemProducto= {id:idNuevoProducto, nombreProducto:nuevoProducto};
        this.configurar.agregarDatosProducto(nuevoItemProducto).subscribe({
          next: () => {
            this.ingresoProducto.reset();
            document.getElementById("cerrarModalNuevoProducto")?.click();
            this.ngOnInit();
          },
          error: (e) => {
            alert(
              "Error al intentar registrar el producto. Por favor intente nuevamente. "+e
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
    const nuevaMarca = this.ingresoMarca.get("formNuevaMarca")?.value;
    const idNuevaMarca = 0;
    let nuevoItemMarca:MarcaInterface | undefined=undefined;
    if (nuevaMarca != "" && nuevaMarca != null) {
      for (const item of this.marca) {
        if (item == nuevaMarca) {
          valorRepetido = true;
          alert("VALOR REPETIDO!!!"); //Cambiar por algo mas estetico.
          this.ingresoMarca.reset();
        }
      }
      if (valorRepetido == false) {
        nuevoItemMarca = {id:idNuevaMarca, nombreMarca:nuevaMarca};
        this.configurar.agregarDatosMarca(nuevoItemMarca).subscribe({
          next: () => {
            this.ingresoMarca.reset();
            document.getElementById("cerrarModalNuevaMarca")?.click();
            this.ngOnInit();
          },
          error: (e) => {
            alert(
              "Error al intentar registrar la marca. Por favor intente nuevamente. "+e
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
    let nuevoItemProveedor:ProveedorInterface | undefined=undefined;
    if (this.collapseProducto) {
      nuevoProveedor = this.ingresoProveedor.get("formNuevoProveedor")?.value;
    } else {
      nuevoProveedor = this.proveedores.get("formProveedor")?.value;
      nuevoProveedorTelefono = this.proveedores.get("formTelefono")?.value;
      nuevoProveedorEmail = this.proveedores.get("formEmail")?.value;
    }
    const idNuevoProveedor = 0;
    if (nuevoProveedor != "" && nuevoProveedor != null) {
      for (const item of this.listaDeProveedores) {
        if (item.nombreProveedor == nuevoProveedor) {
          valorRepetido = true;
          alert("VALOR REPETIDO!!!"); //Cambiar por algo mas estetico.
          this.ingresoProveedor.reset();
        }
      }
      if (valorRepetido == false) {
        nuevoItemProveedor = {
          id:idNuevoProveedor,
          nombreProveedor:nuevoProveedor,
          telefonoProveedor:nuevoProveedorTelefono,
          emailProveedor:nuevoProveedorEmail
        };
        
        this.configurar.agregarDatosProveedor(nuevoItemProveedor).subscribe({
          next: () => {
            this.ingresoProveedor.reset();
            document.getElementById("cerrarModalNuevoProveedor")?.click();
            this.ngOnInit();
            this.proveedores.reset();
          },
          error: (e) => {
            alert(
              "Error al intentar registrar el proveedor. Por favor intente nuevamente. "+e
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
    for (const item of this.listaDeProveedores) {
      if (item.id == id) {
        this.proveedores.get("formProveedor")?.setValue(item.nombreProveedor);
        this.proveedores.get("formTelefono")?.setValue(item.telefonoProveedor);
        this.proveedores.get("formEmail")?.setValue(item.emailProveedor);
      }
    }
  }

  editarProveedor() {
    if (this.proveedores.valid) {
      const proveedor = this.proveedores.get("formProveedor")?.value;
      const telefono = this.proveedores.get("formTelefono")?.value;
      const email = this.proveedores.get("formEmail")?.value;
      let proveedorEditado:ProveedorInterface | undefined=undefined;
      proveedorEditado = {id:this.id, nombreProveedor:proveedor, telefonoProveedor:telefono, emailProveedor:email};
      this.configurar
        .editarDatosProveedor(this.id, proveedorEditado)
        .subscribe({
          next: () => {
            alert("Datos Actualizados Correctamente");
            this.ngOnInit();
            this.proveedores.reset();
          },
          error: (e) => {
            alert(
              "Error al intentar actualizar los datos. Por favor intente nuevamente. "+e
            );
          },
        });
      this.id = 0;
    } else {
      this.proveedores.markAllAsTouched();
      alert("Atencion! uno o mas campos requeridos no han sido completados!!");
    }
  }

  borrarProveedor() {
    if (this.id != 0) {
      this.configurar.borrarProveedor(this.id).subscribe({
        next: () => {
          alert("Proveedor Eliminado Correctamente");
          this.ngOnInit();
          this.proveedores.reset();
        },
        error: (e) => {
          alert(
            "Error al intentar borrar la seleccion. Por favor intente nuevamente. "+e
          );
        },
      });
    }
    this.id = 0;
  }
}
