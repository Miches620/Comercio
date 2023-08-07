import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Login } from 'src/app/entidades/login';
import { loginAdmin } from 'src/app/servicios/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  @Input() dataEntrante:any
  contraseña: any;
  datosLogin: any;
  formulario: FormGroup;
  login:boolean=false;
  logout:boolean=true;
    constructor(
    private loginFormBuilder: FormBuilder, private servicio: loginAdmin
  ) {
    this.formulario = this.loginFormBuilder.group({
      ingresoUsuario: ['', [Validators.required]],
      ingresoContraseña: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    
}

limpiarFormulario() {
  this.formulario.reset();
}

iniciarSesion(){
if(this.formulario.valid){
  let user=this.formulario.get('ingresoUsuario')?.value;
  let pwd=this.formulario.get('ingresoContraseña')?.value
  let login = new Login(1,user,pwd);
  this.servicio.obtenerAccesoAdmin(login).subscribe({ //aca falla porque aun no tengo el backend hecho!!!!!!
    next:(data) =>{
      console.log(data);
     if(data==true){
       this.dataEntrante=data;
       this.login=true;
       this.logout=false;
       this.servicio.iniciarSesion.emit({data:this.dataEntrante})
      document.getElementById('cerrarLogin')?.click();
      this.limpiarFormulario();
      
      }else{
        
        alert("Los datos ingresados son incorrectos. Por favor intente nuevamente.")
      }
    },
    error:(error) =>{
      alert("Error al intentar ingresar los datos. Por favor intente nuevamente");
    }
  })
}else{
  alert(
    'Error al actualizar los datos. Verifique que los datos ingresados cumplan con las condiciones de ingreso'
  );
  this.formulario.markAllAsTouched();
}
}

cerrarSesion(){
  this.dataEntrante=false;
       this.login=false;
       this.logout=true;
       this.servicio.cerrarSesion.emit({data:this.dataEntrante})
      document.getElementById('cerrarLogout')?.click();
}
}
