import { EventEmitter, Injectable, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Login } from '../entidades/login';

@Injectable({
  providedIn: 'root',
})
export class loginAdmin {
  @Output() iniciarSesion: EventEmitter<any> = new EventEmitter()
  @Output() cerrarSesion: EventEmitter<any> = new EventEmitter()
  url:string="http://localhost:3000/login"
  constructor(private http: HttpClient) {
  }

  obtenerAccesoAdmin(login:Login):Observable<any>{
    return this.http.post(this.url,login);
  }
}
