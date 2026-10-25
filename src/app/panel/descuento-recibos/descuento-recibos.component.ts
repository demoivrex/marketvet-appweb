import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-descuento-recibos',
  templateUrl: './descuento-recibos.component.html',
  styleUrls: ['./descuento-recibos.component.css']
})
export class DescuentoRecibosComponent implements OnInit {

  descuento: any;
  seccionURL: string = this.router.url.slice(1);
  constructor(private router: Router, private LOG: LogService, private fb: FirebaseService) { }

  ngOnInit(): void {
    this.descuentos();
  }

  descuentos() {
    this.fb.cargarDescuentos().subscribe(resp => {
      this.descuento = resp;
    })
  }

  actualizarDescuentos() {
    let resguardo = [];
    for (let i = 0; i < this.descuento.length; i++) {
      resguardo.push(JSON.parse(JSON.stringify(this.descuento[i])))
    }
    this.fb.actualizarDescuentos(this.descuento).subscribe();
  }

}
