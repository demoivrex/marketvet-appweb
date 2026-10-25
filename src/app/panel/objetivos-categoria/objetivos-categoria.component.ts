import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { CalculosService } from '../../services/calculos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-objetivos-categoria',
  templateUrl: './objetivos-categoria.component.html',
  styleUrls: ['./objetivos-categoria.component.css'],
})
export class ObjetivosCategoriaComponent implements OnInit {
  primerMes; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  segundoMes; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  tercerMes; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE

  objetivos;
  sumatorias;

  //ARREGLOS PARA SEPARAR LOS CANALES
  mes1tradicional;
  mes2tradicional;
  mes3tradicional;
  mes1distribuidores;
  mes2distribuidores;
  mes3distribuidores;
  mes1digital;
  mes2digital;
  mes3digital;

  //SUMATORIAS
  ventas1: number = 0;
  ventas2: number = 0;
  ventas3: number = 0;
  cant1: number = 0;
  cant2: number = 0;
  cant3: number = 0;
  kg1: number = 0;
  kg2: number = 0;
  kg3: number = 0;
  ventas4: number = 0;
  ventas5: number = 0;
  ventas6: number = 0;
  cant4: number = 0;
  cant5: number = 0;
  cant6: number = 0;
  kg4: number = 0;
  kg5: number = 0;
  kg6: number = 0;

  ventasd1: number = 0;
  ventasd2: number = 0;
  ventasd3: number = 0;
  cantd1: number = 0;
  cantd2: number = 0;
  cantd3: number = 0;
  kgd1: number = 0;
  kgd2: number = 0;
  kgd3: number = 0;

  ventasto11: number = 0;
  ventasto12: number = 0;
  ventasto13: number = 0;
  ventasto21: number = 0;
  ventasto22: number = 0;
  ventasto23: number = 0;
  ventasto31: number = 0;
  ventasto32: number = 0;
  ventasto33: number = 0;
  ventasdif1: number = 0;
  ventasdif2: number = 0;
  ventasdif3: number = 0;
  cantto11: number = 0;
  cantto12: number = 0;
  cantto13: number = 0;
  cantto21: number = 0;
  cantto22: number = 0;
  cantto23: number = 0;
  cantto31: number = 0;
  cantto32: number = 0;
  cantto33: number = 0;
  cantdif1: number = 0;
  cantdif2: number = 0;
  cantdif3: number = 0;
  kgto11: number = 0;
  kgto13: number = 0;
  kgto12: number = 0;
  kgto21: number = 0;
  kgto22: number = 0;
  kgto23: number = 0;
  kgto31: number = 0;
  kgto33: number = 0;
  kgto32: number = 0;
  kgdif1: number = 0;
  kgdif2: number = 0;
  kgdif3: number = 0;

  mes: string = '01';
  ano: string = '2024';

  listaAnios: string[] = [];

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
    this.cargarTrimestre((Number(this.mes) - 1).toString().padStart(2, '0'), this.mes, (Number(this.mes) + 1).toString().padStart(2, '0')); //Función que trae el primer mes, luego el segundo, luego el tercero y al final calcula las sumatorias
  }

  cargarTrimestre(mes1: string, mes2: string, mes3: string) {
    this.fb.cargarObjetivos(mes1, this.ano).subscribe((resp1: any) => {
      this.primerMes = resp1;
      this.fb.cargarObjetivos(mes2, this.ano).subscribe((resp2: any) => {
        this.segundoMes = resp2;
        this.fb.cargarObjetivos(mes3, this.ano).subscribe((resp3: any) => {
          this.tercerMes = resp3;
          this.calcularSumatorias();
          Swal.close();
        });
      });
    });
  }

  calcularSumatorias() {
    // ESTA FUNCIÓN REALIZA LAS SUMATORIAS
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
    this.separarObjetivos();
  }

  calcularTotales() {
    //SUMATORIAS
    this.ventas1 = 0;
    this.ventas2 = 0;
    this.ventas3 = 0;
    this.cant1 = 0;
    this.cant2 = 0;
    this.cant3 = 0;
    this.kg1 = 0;
    this.kg2 = 0;
    this.kg3 = 0;
    this.ventasd1 = 0;
    this.ventasd2 = 0;
    this.ventasd3 = 0;
    this.cantd1 = 0;
    this.cantd2 = 0;
    this.cantd3 = 0;
    this.kgd1 = 0;
    this.kgd2 = 0;
    this.kgd3 = 0;
    this.ventas4 = 0;
    this.ventas5 = 0;
    this.ventas6 = 0;
    this.cant4 = 0;
    this.cant5 = 0;
    this.cant6 = 0;
    this.kg4 = 0;
    this.kg5 = 0;
    this.kg6 = 0;
    this.ventasto11 = 0;
    this.ventasto12 = 0;
    this.ventasto13 = 0;
    this.ventasto21 = 0;
    this.ventasto22 = 0;
    this.ventasto23 = 0;
    this.ventasto31 = 0;
    this.ventasto32 = 0;
    this.ventasto33 = 0;
    this.ventasdif1 = 0;
    this.ventasdif2 = 0;
    this.ventasdif3 = 0;
    this.cantto11 = 0;
    this.cantto12 = 0;
    this.cantto13 = 0;
    this.cantto21 = 0;
    this.cantto22 = 0;
    this.cantto23 = 0;
    this.cantto31 = 0;
    this.cantto32 = 0;
    this.cantto33 = 0;
    this.cantdif1 = 0;
    this.cantdif2 = 0;
    this.cantdif3 = 0;
    this.kgto11 = 0;
    this.kgto12 = 0;
    this.kgto13 = 0;
    this.kgto21 = 0;
    this.kgto22 = 0;
    this.kgto23 = 0;
    this.kgto31 = 0;
    this.kgto32 = 0;
    this.kgto33 = 0;
    this.kgdif1 = 0;
    this.kgdif2 = 0;
    this.kgdif3 = 0;

    for (let i = 0; i < this.mes1tradicional.length; i++) {
      this.ventas1 = this.ventas1 + Number(this.mes1tradicional[i].ventas);
      this.ventas2 = this.ventas2 + Number(this.mes2tradicional[i].ventas);
      this.ventas3 = this.ventas3 + Number(this.mes3tradicional[i].ventas);
      this.ventasto11 =
        this.ventasto11 + Number(this.mes1tradicional[i].ventasobj);
      this.ventasto12 =
        this.ventasto12 + Number(this.mes2tradicional[i].ventasobj);
      this.ventasto13 =
        this.ventasto13 + Number(this.mes3tradicional[i].ventasobj);
      this.ventasdif1 =
        this.ventas1 +
        this.ventas2 +
        this.ventas3 -
        (this.ventasto11 + this.ventasto12 + this.ventasto13);
      this.cant1 = this.cant1 + Number(this.mes1tradicional[i].cant);
      this.cant2 = this.cant2 + Number(this.mes2tradicional[i].cant);
      this.cant3 = this.cant3 + Number(this.mes3tradicional[i].cant);
      this.cantto11 = this.cantto11 + Number(this.mes1tradicional[i].cantobj);
      this.cantto12 = this.cantto12 + Number(this.mes2tradicional[i].cantobj);
      this.cantto13 = this.cantto13 + Number(this.mes3tradicional[i].cantobj);
      this.cantdif1 =
        this.cant1 +
        this.cant2 +
        this.cant3 -
        (this.cantto11 + this.cantto12 + this.cantto13);
      this.kg1 = this.kg1 + Number(this.mes1tradicional[i].kg);
      this.kg2 = this.kg2 + Number(this.mes2tradicional[i].kg);
      this.kg3 = this.kg3 + Number(this.mes3tradicional[i].kg);
      this.kgto11 = this.kgto11 + Number(this.mes1tradicional[i].kgobj);
      this.kgto12 = this.kgto12 + Number(this.mes2tradicional[i].kgobj);
      this.kgto13 = this.kgto13 + Number(this.mes3tradicional[i].kgobj);
      this.kgdif1 =
        this.kg1 +
        this.kg2 +
        this.kg3 -
        (this.kgto11 + this.kgto12 + this.kgto13);
    }
    for (let i = 0; i < this.mes1distribuidores.length; i++) {
      this.ventas4 = this.ventas4 + Number(this.mes1distribuidores[i].ventas);
      this.ventas5 = this.ventas5 + Number(this.mes2distribuidores[i].ventas);
      this.ventas6 = this.ventas6 + Number(this.mes3distribuidores[i].ventas);
      this.ventasto21 =
        this.ventasto21 + Number(this.mes1distribuidores[i].ventasobj);
      this.ventasto22 =
        this.ventasto22 + Number(this.mes2distribuidores[i].ventasobj);
      this.ventasto23 =
        this.ventasto23 + Number(this.mes3distribuidores[i].ventasobj);
      this.ventasdif2 =
        this.ventas4 +
        this.ventas5 +
        this.ventas6 -
        (this.ventasto21 + this.ventasto22 + this.ventasto23);
      this.cant4 = this.cant4 + Number(this.mes1distribuidores[i].cant);
      this.cant5 = this.cant5 + Number(this.mes2distribuidores[i].cant);
      this.cant6 = this.cant6 + Number(this.mes3distribuidores[i].cant);
      this.cantto21 =
        this.cantto21 + Number(this.mes1distribuidores[i].cantobj);
      this.cantto22 =
        this.cantto22 + Number(this.mes2distribuidores[i].cantobj);
      this.cantto23 =
        this.cantto23 + Number(this.mes3distribuidores[i].cantobj);
      this.cantdif2 =
        this.cant4 +
        this.cant5 +
        this.cant6 -
        (this.cantto21 + this.cantto22 + this.cantto23);
      this.kg4 = this.kg4 + Number(this.mes1distribuidores[i].kg);
      this.kg5 = this.kg5 + Number(this.mes2distribuidores[i].kg);
      this.kg6 = this.kg6 + Number(this.mes3distribuidores[i].kg);
      this.kgto21 = this.kgto21 + Number(this.mes1distribuidores[i].kgobj);
      this.kgto22 = this.kgto22 + Number(this.mes2distribuidores[i].kgobj);
      this.kgto23 = this.kgto23 + Number(this.mes3distribuidores[i].kgobj);
      this.kgdif2 =
        this.kg4 +
        this.kg5 +
        this.kg6 -
        (this.kgto21 + this.kgto22 + this.kgto23);
    }
    for (let i = 0; i < this.mes1digital.length; i++) {
      this.ventasd1 = this.ventasd1 + Number(this.mes1digital[i].ventas);
      this.ventasd2 = this.ventasd2 + Number(this.mes2digital[i].ventas);
      this.ventasd3 = this.ventasd3 + Number(this.mes3digital[i].ventas);
      this.ventasto31 = this.ventasto31 + Number(this.mes1digital[i].ventasobj);
      this.ventasto32 = this.ventasto32 + Number(this.mes2digital[i].ventasobj);
      this.ventasto33 = this.ventasto33 + Number(this.mes3digital[i].ventasobj);
      this.ventasdif3 =
        this.ventasd1 +
        this.ventasd2 +
        this.ventasd3 -
        (this.ventasto31 + this.ventasto32 + this.ventasto33);
      this.cantd1 = this.cantd1 + Number(this.mes1digital[i].cant);
      this.cantd2 = this.cantd2 + Number(this.mes2digital[i].cant);
      this.cantd3 = this.cantd3 + Number(this.mes3digital[i].cant);
      this.cantto31 = this.cantto31 + Number(this.mes1digital[i].cantobj);
      this.cantto32 = this.cantto32 + Number(this.mes2digital[i].cantobj);
      this.cantto33 = this.cantto33 + Number(this.mes3digital[i].cantobj);
      this.cantdif3 =
        this.cantd1 +
        this.cantd2 +
        this.cantd3 -
        (this.cantto31 + this.cantto32 + this.cantto33);
      this.kgd1 = this.kgd1 + Number(this.mes1digital[i].kg);
      this.kgd2 = this.kgd2 + Number(this.mes2digital[i].kg);
      this.kgd3 = this.kgd3 + Number(this.mes3digital[i].kg);
      this.kgto31 = this.kgto31 + Number(this.mes1digital[i].kgobj);
      this.kgto32 = this.kgto32 + Number(this.mes2digital[i].kgobj);
      this.kgto33 = this.kgto33 + Number(this.mes3digital[i].kgobj);
      this.kgdif3 =
        this.kgd1 +
        this.kgd2 +
        this.kgd3 -
        (this.kgto31 + this.kgto32 + this.kgto33);
    }
  }

  //ASIGNAR RANGO DE COLORES A OBJETIVO
  asignarRangoSemaforo(valor: number) {
    return this.calculos.asignarColorSemaforo(valor);
  }

  asignarSemaforoSumatoria(valor: number) {
    return this.calculos.asignarSemaforoSumatoria(valor);
  }

  separarObjetivos() {
    this.mes1tradicional = this.primerMes.filter(
      (item) => item.canal == 'tradicional'
    );
    this.mes2tradicional = this.segundoMes.filter(
      (item) => item.canal == 'tradicional'
    );
    this.mes3tradicional = this.tercerMes.filter(
      (item) => item.canal == 'tradicional'
    );
    this.mes1distribuidores = this.primerMes.filter(
      (item) => item.canal == 'distribuidores'
    );
    this.mes2distribuidores = this.segundoMes.filter(
      (item) => item.canal == 'distribuidores'
    );
    this.mes3distribuidores = this.tercerMes.filter(
      (item) => item.canal == 'distribuidores'
    );
    this.mes1digital = this.primerMes.filter((item) => item.canal == 'digital');
    this.mes2digital = this.segundoMes.filter(
      (item) => item.canal == 'digital'
    );
    this.mes3digital = this.tercerMes.filter((item) => item.canal == 'digital');

    this.calcularTotales();
  }
}
