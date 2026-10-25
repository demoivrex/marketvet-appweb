import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { CalculosService } from '../../services/calculos.service';

@Component({
  selector: 'app-objetivos-panel',
  templateUrl: './objetivos-panel.component.html',
  styleUrls: ['./objetivos-panel.component.css'],
})
export class ObjetivosPanelComponent implements OnInit {
  //ARREGLOS CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  primerMesTrad; 
  segundoMesTrad;
  tercerMesTrad;
  primerMesDist;
  segundoMesDist;
  tercerMesDist;
  primerMesDig;
  segundoMesDig;
  tercerMesDig;

  objetivos;

  mes: string = '01';
  ano: string = '2024';

  listaAnios: string[] = [];

  promediosMes1Trad;
  promediosMes1Dist;
  promediosMes1Dig;
  promediosMes2Trad;
  promediosMes2Dist;
  promediosMes2Dig;
  promediosMes3Trad;
  promediosMes3Dist;
  promediosMes3Dig;

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
    //CARGO OBJETIVOS MES 1
    this.fb.cargarObjetivos((Number(this.mes) - 1).toString().padStart(2, '0'), this.ano).subscribe((resp1: any) => {

      this.primerMesTrad = resp1.filter((item) => item.canal == 'tradicional');
      this.primerMesDist = resp1.filter((item) => item.canal == 'distribuidores');
      this.primerMesDig = resp1.filter((item) => item.canal == 'digital');

      this.promediosMes1Trad = this.calcularTotales(this.primerMesTrad);
      this.promediosMes1Dist = this.calcularTotales(this.primerMesDist);
      this.promediosMes1Dig = this.calcularTotales(this.primerMesDig);
    });

    //CARGO OBJETIVOS MES 2
    this.fb.cargarObjetivos(this.mes, this.ano).subscribe((resp2: any) => {
      this.segundoMesTrad = resp2.filter((item) => item.canal == 'tradicional');
      this.segundoMesDist = resp2.filter((item) => item.canal == 'distribuidores');
      this.segundoMesDig = resp2.filter((item) => item.canal == 'digital');

      this.promediosMes2Trad = this.calcularTotales(this.segundoMesTrad);
      this.promediosMes2Dist = this.calcularTotales(this.segundoMesDist);
      this.promediosMes2Dig = this.calcularTotales(this.segundoMesDig);
    });

    //CARGO OBJETIVOS MES 3
    this.fb.cargarObjetivos((Number(this.mes) + 1).toString().padStart(2, '0'), this.ano).subscribe((resp3: any) => {
      this.tercerMesTrad = resp3.filter((item) => item.canal == 'tradicional');
      this.tercerMesDist = resp3.filter((item) => item.canal == 'distribuidores');
      this.tercerMesDig = resp3.filter((item) => item.canal == 'digital');

      this.promediosMes3Trad = this.calcularTotales(this.tercerMesTrad);
      this.promediosMes3Dist = this.calcularTotales(this.tercerMesDist);
      this.promediosMes3Dig = this.calcularTotales(this.tercerMesDig);
    });
  }

  calcularTotales(valores) {
    let ventas = 0;
    let cant = 0;
    let kg = 0;
    let coef = 0;

    for (let i = 0; i < valores.length; i++) {
      ventas += valores[i].ventasp;
      cant += valores[i].cantp;
      kg += valores[i].kgp;
    }

    ventas = ventas / valores.length;
    cant = cant / valores.length;
    kg = kg / valores.length;
    coef = (ventas + cant + kg) / 3;

    let promedios = [
      {
        ventas,
        cant,
        kg,
        coef,
      },
    ];
    return promedios;
  }

  //ASIGNAR RANGO DE COLORES A OBJETIVO
  asignarRangoSemaforo(valor: number) {
    return this.calculos.asignarColorSemaforo(valor);
  }
}
