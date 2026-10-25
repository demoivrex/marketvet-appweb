import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { CalculosService } from '../../services/calculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ventas-digital',
  templateUrl: './ventas-digital.component.html',
  styleUrls: ['./ventas-digital.component.css'],
})
export class VentasDigitalComponent implements OnInit {
  objetivos; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  objDigitales; //ARREGLO FILTRADO CON LOS OBJETIVOS DEL CANAL DIGITALES
  diasMes = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  ventasTotalesDigital: number;
  ventasTotalesVendedores: number;
  ventasTotalesCanal: number;

  mes: string = '01';
  ano: string = new Date().getFullYear().toString();

  constructor(private fb: FirebaseService, private calculos: CalculosService) {}

  ngOnInit(): void {
    this.obtenerFecha();
    this.objetivo();
  }

  obtenerFecha() {
    const today = new Date();
    this.mes = ('0' + (today.getMonth() + 1)).slice(-2);
    this.ano = today.getFullYear().toString();
  }

  objetivo() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando datos de objetivos',
      icon: 'info',
    });
    Swal.showLoading();
    this.fb.cargarObjetivos(this.mes, this.ano).subscribe((resp: any) => {
      this.objetivos = resp;
      this.separarObjetivos();
    });
    Swal.close();
  }

  buscarDatosObjetivos() {
    this.objetivo();
  }

  separarObjetivos() {
    this.objDigitales = this.objetivos.filter(
      (item) => item.canal == 'digital'
    );
    console.log("OBJ DIGITAL",this.objDigitales);
    this.calcularTotales();
  }

  calcularTotales() {
    this.ventasTotalesVendedores = 0;
    this.ventasTotalesDigital = 0;
    this.ventasTotalesCanal = 0;
    for (let i = 0; i < this.objDigitales.length; i++) {
      this.ventasTotalesCanal += this.objDigitales[i].ventasDigital;
      this.ventasTotalesDigital += this.objDigitales[i].ventas;
      this.ventasTotalesVendedores +=
        this.objDigitales[i].ventasDigital - this.objDigitales[i].ventas;
    }
  }
}
