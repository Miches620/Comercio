import { NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfiguracionComponent } from './componentes/configuracion/configuracion.component';
import { HeaderComponent } from './componentes/header/header.component';
import {HttpClientModule} from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { StockComponent } from './componentes/stock/stock.component';
import { AdminService } from './servicios/admin.service';
import { FacturacionComponent } from './componentes/facturacion/facturacion.component';

@NgModule({
  declarations: [
    AppComponent,
    ConfiguracionComponent,
    HeaderComponent,
    StockComponent,
    FacturacionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule{}

