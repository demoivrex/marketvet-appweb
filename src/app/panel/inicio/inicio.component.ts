import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { environment } from '../../../environments/environment';

declare var mapboxgl: any;

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  recibos: any[] = [];
  recibosLista: any[] = [];

  /* SALDOS TOTALES */
  rendirTotal: number;
  rendirEfectivo: number;
  rendirCheques: number;
  rendirDepositos: number;

  /* SALDOS PARCIALES TABLA FILTRADA */
  parcialTotal: number;
  parcialEfectivo: number;
  parcialCheques: number;
  parcialDepositos: number;

  constructor(private fb: FirebaseService) { }

  ngOnInit(): void {
    this.esAdministrador();
    this.iniciar();
  }

  esAdministrador() {
    const user = localStorage.getItem('user');
    if (user == "rominagetti@hotmail.com" || user == "bioing.equiroz@gmail.com") {
      return true;
    } else {
      return false;
    }
  }

  esAprobadorRecibos() {
    const user = localStorage.getItem('user');
    if (user == "adm.marketvet@gmail.com") {
      return true;
    } else {
      return false;
    }
  }

  iniciar() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando recibos pendientes de rendir',
      icon: 'info',
    });
    Swal.showLoading();
    this.fb.cargarRecibos().subscribe(resp => {
      this.recibos = resp.filter(item => !item.rendido); //LISTA QUE SE MUESTRA EN PANTALLA
      this.recibosLista = resp.filter(item => !item.rendido); //LISTA QUE SE FILTRA
      Swal.close();
    })
  }

  eliminarRecibo(recibo, i) {
    Swal.fire({
      title: 'Desea eliminar el Recibo?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fb.eliminarRecibo(recibo.id).subscribe();
        this.recibos.splice(i, 1);
        Swal.fire('Eliminado!', '', 'success');
      }
    })
  }

  eliminarRecibos() {
    Swal.fire({
      title: 'Desea eliminar los recibos seleccionados?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        for (let i = 0; i < this.recibos.length; i++) {
          this.fb.eliminarRecibo(this.recibos[i].id).subscribe();
        }
        Swal.fire('Eliminado!', '', 'success');
        this.iniciar(); //VOLVER A CARGAR LOS RECIBOS
      }
    })
  }

  geolocalizarRecibo(geoRecibo) {
    const latLng = geoRecibo.split(',');
    const lat = Number(latLng[0]);
    const lng = Number(latLng[1]);
    mapboxgl.accessToken = environment.mapboxAccessToken;
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12
    });
    const marker = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(map);
  }


  calculoTotales(recibos) {
    this.rendirTotal = recibos
      .map(item => Number(item.total))
      .reduce((count, item) => count + item, 0);
    this.rendirEfectivo = recibos
      .map(item => Number(item.efectivo))
      .reduce((count, item) => count + item, 0);
    this.rendirCheques = recibos
      .map(item => Number(item.cheque))
      .reduce((count, item) => count + item, 0);
    this.rendirDepositos = recibos
      .map(item => Number(item.deposito))
      .reduce((count, item) => count + item, 0);
  }

  actualizar() {
    this.fb.cargarRecibos().subscribe(resp => {
      this.recibos = resp.filter(item => !item.rendido);
      this.recibosLista = resp.filter(item => !item.rendido);
      this.calculoParciales(this.recibos);
      this.calculoTotales(this.recibos);
    })
  }

  rendir(recibo) {
    recibo.rendido = !recibo.rendido;
    this.fb.actualizarRecibo(recibo).subscribe();
  }

  calculoParciales(recibos) {
    this.parcialTotal = recibos
      .map(item => Number(item.total))
      .reduce((count, item) => count + item, 0);
    this.parcialEfectivo = recibos
      .map(item => Number(item.efectivo))
      .reduce((count, item) => count + item, 0);
    this.parcialCheques = recibos
      .map(item => Number(item.cheque))
      .reduce((count, item) => count + item, 0);
    this.parcialDepositos = recibos
      .map(item => Number(item.deposito))
      .reduce((count, item) => count + item, 0);
  }

  /* FILTROS */
  filtrar(key: string) {
    this.recibos = this.recibosLista.filter(item => {
      return !item.rendido && item.vendedor.trim() === key;
    });
    console.log('RECIBOS', this.recibos);
    this.calculoParciales(this.recibos);
  }

  aprobarListaRecibos(recibosVendedor) {
    for (let i = 0; i < recibosVendedor.length; i++) {
      recibosVendedor[i].rendido = true;
      this.fb.actualizarRecibo(recibosVendedor[i]).subscribe();
    }
    this.iniciar();
  }


}
