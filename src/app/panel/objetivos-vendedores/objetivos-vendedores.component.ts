import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { CalculosService } from '../../services/calculos.service';

@Component({
  selector: 'app-objetivos-vendedores',
  templateUrl: './objetivos-vendedores.component.html',
  styleUrls: ['./objetivos-vendedores.component.css'],
})
export class ObjetivosVendedoresComponent implements OnInit {
  //ARREGLOS CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  primerMes; 
  segundoMes;
  tercerMes;
  objetivos;

  listaAnios: string[] = [];

  mes: string;
  ano: string;

  constructor(private fb: FirebaseService, private calculos: CalculosService) {}

  ngOnInit(): void {
    this.obtenerFecha();
    this.cargarObjetivos();
  }

  obtenerFecha() {
    const today = new Date();
    let mesSelect = ('0' + (today.getMonth() + 1)).slice(-2);
    this.ano = today.getFullYear().toString();

    for (let i = 2021; i <= Number(this.ano); i++) {
      this.listaAnios.push(i.toString());
    }

    switch (Number(mesSelect)) {
      case 1:
      case 2:
      case 3:
        this.mes = '02'
        break;
      case 4:
      case 5:
      case 6:
        this.mes = '05'
        break;
      case 7:
      case 8:
      case 9:
        this.mes = '08'
        break;
      default:
        this.mes = '11'
        break;
    }
  }

  cargarObjetivos() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando datos de objetivos',
      icon: 'info',
    });
    Swal.showLoading();
    this.cargarTrimestre((Number(this.mes) - 1).toString().padStart(2, '0'), this.mes, (Number(this.mes) + 1).toString().padStart(2, '0'));
  }

  cargarTrimestre(mes1: string, mes2: string, mes3: string) {
    this.fb.cargarObjetivos(mes1, this.ano).subscribe((resp1: any) => {
      this.primerMes = resp1;
      this.fb.cargarObjetivos(mes2, this.ano).subscribe((resp2: any) => {
        this.segundoMes = resp2;
        this.fb.cargarObjetivos(mes3, this.ano).subscribe((resp3: any) => {
          this.tercerMes = resp3;
          this.calcularSumatorias();
        });
      });
    });
    Swal.close();
  }

  calcularSumatorias() {
    for (let i = 0; i < this.primerMes.length; i++) {
      this.primerMes[i].ventasTotales =
        Number(this.primerMes[i].ventas) +
        Number(this.segundoMes[i].ventas) +
        Number(this.tercerMes[i].ventas);
      this.primerMes[i].ventasDif =
        Number(this.primerMes[i].ventasTotales) -
        (Number(this.primerMes[i].ventasobj) +
          Number(this.segundoMes[i].ventasobj) +
          Number(this.tercerMes[i].ventasobj));
      this.primerMes[i].kgTotales =
        Number(this.primerMes[i].kg) +
        Number(this.segundoMes[i].kg) +
        Number(this.tercerMes[i].kg);
      this.primerMes[i].kgDif =
        Number(this.primerMes[i].kgTotales) -
        (Number(this.primerMes[i].kgobj) +
          Number(this.segundoMes[i].kgobj) +
          Number(this.tercerMes[i].kgobj));
      this.primerMes[i].cantTotales =
        Number(this.primerMes[i].cant) +
        Number(this.segundoMes[i].cant) +
        Number(this.tercerMes[i].cant);
      this.primerMes[i].cantDif =
        Number(this.primerMes[i].cantTotales) -
        (Number(this.primerMes[i].cantobj) +
          Number(this.segundoMes[i].cantobj) +
          Number(this.tercerMes[i].cantobj));
    }
  }

  //ASIGNAR RANGO DE COLORES A OBJETIVO
  asignarRangoSemaforo(valor: number) {
    return this.calculos.asignarColorSemaforo(valor);
  }

  //ASIGNAR RANGO DE COLORES A OBJETIVO
  asignarSemaforoSumatoria(valor: number) {
    return this.calculos.asignarSemaforoSumatoria(valor);
  }
}
