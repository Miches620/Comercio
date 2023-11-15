import { Component, OnInit } from "@angular/core";
import { AdminService } from "./servicios/admin.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit{
  title = "comercio";
  SelecNavBar:number=0;

  constructor(private seleccion:AdminService){

  }

  ngOnInit(): void {
    this.seleccion.navBar.subscribe(seleccion =>{
      this.SelecNavBar=seleccion.data;
    });
  }
}
