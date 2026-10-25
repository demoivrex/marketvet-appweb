import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';
import { FirebaseService } from '../../services/firebase.service';

@Component({
  selector: 'app-graficas',
  templateUrl: './graficas.component.html',
  styleUrls: ['./graficas.component.css'],
})
export class GraficasComponent implements OnInit {
  constructor(private fb: FirebaseService) {}

  mesGraficas = '04';
  anoGraficas = '2023';

  sum;
  mes = [];
  ventastrad = [];
  canttrad = [];
  kgtrad = [];
  arfvtrad = [];
  arfctrad = [];
  ventasdist = [];
  cantdist = [];
  kgdist = [];
  arfvdist = [];
  arfcdist = [];
  objventastrad = [];
  objcanttrad = [];
  objkgtrad = [];
  objarfvtrad = [];
  objarfctrad = [];
  objventasdist = [];
  objcantdist = [];
  objkgdist = [];
  objarfvdist = [];
  objarfcdist = [];

  ventasradGraf = [];
  ventasDistGraf = [];
  cantTradGraf = [];
  cantDistGraf = [];
  kgTradGraf = [];
  kgDistGraf = [];
  arfvTradGraf = [];
  arfvDistGraf = [];
  arfcTradGraf = [];
  arfcDistGraf = [];

  ngOnInit(): void {
    this.obtenerFecha();
    this.fb
      .cargarSumatorias(this.mesGraficas, this.anoGraficas)
      .subscribe((resp) => {
        if (resp) {
          this.generarArregloDatos(resp);
          this.graficosLineas();
        }
        else {
          this.obtenerFechaMesAnterior();
          this.fb.cargarSumatorias(this.mesGraficas, this.anoGraficas).subscribe((resp) => {
            if (resp) {
              this.generarArregloDatos(resp);
              this.graficosLineas();
            }
          });
        }
      });
  }

  obtenerFecha() {
    const today = new Date();
    this.mesGraficas = ('0' + (today.getMonth() + 1)).slice(-2);
    this.anoGraficas = today.getFullYear().toString();
  }

  obtenerFechaMesAnterior() {
    const today = new Date();
    this.mesGraficas = ('0' + (today.getMonth())).slice(-2);
    this.anoGraficas = today.getFullYear().toString();
  }

  /*>> LIMPIAR ARREGLO */
  limpiarSumatoria() {
    this.mes = [];
    this.ventastrad = [];
    this.canttrad = [];
    this.kgtrad = [];
    this.arfvtrad = [];
    this.arfctrad = [];
    this.ventasdist = [];
    this.cantdist = [];
    this.kgdist = [];
    this.arfvdist = [];
    this.arfcdist = [];
    this.objventastrad = [];
    this.objcanttrad = [];
    this.objkgtrad = [];
    this.objarfvtrad = [];
    this.objarfctrad = [];
    this.objventasdist = [];
    this.objcantdist = [];
    this.objkgdist = [];
    this.objarfvdist = [];
    this.objarfcdist = [];
  }

  /* >> ARMADO DE ARREGLOS DE DATOS */
  generarArregloDatos(sum) {
    for (let i = 0; i < sum.length; i++) {
      this.ventastrad.push(sum[i].ventastrad);
      this.ventasdist.push(sum[i].ventasdist);
      this.canttrad.push(sum[i].canttrad);
      this.cantdist.push(sum[i].cantdist);
      this.kgtrad.push(sum[i].kgtrad);
      this.kgdist.push(sum[i].kgdist);
      this.arfvtrad.push(sum[i].arfvtrad);
      this.arfvdist.push(sum[i].arfvdist);
      this.arfctrad.push(sum[i].arfctrad);
      this.arfcdist.push(sum[i].arfcdist);
      this.objventastrad.push(sum[i].objventastrad);
      this.objventasdist.push(sum[i].objventasdist);
      this.objcanttrad.push(sum[i].objcanttrad);
      this.objcantdist.push(sum[i].objcantdist);
      this.objkgtrad.push(sum[i].objkgtrad);
      this.objkgdist.push(sum[i].objkgdist);
      this.objarfvtrad.push(sum[i].objarfvtrad);
      this.objarfvdist.push(sum[i].objarfvdist);
      this.objarfctrad.push(sum[i].objarfctrad);
      this.objarfcdist.push(sum[i].objarfcdist);
      this.mes.push(i);
    }
  }

  cargarDatosGraficos() {
    this.limpiarSumatoria();
    this.fb
      .cargarSumatorias(this.mesGraficas, this.anoGraficas)
      .subscribe((resp) => {
        if (resp) this.generarArregloDatos(resp);
      });
    this.graficosLineas();
  }

  /* >> GRAFICO DE LINEAS */
  graficosLineas() {
    this.ventasradGraf = [
      { data: this.ventastrad, label: 'Tradicional' },
      { data: this.objventastrad, label: 'Objetivos' },
    ];
    this.ventasDistGraf = [
      { data: this.ventasdist, label: 'Distribuidores' },
      { data: this.objventasdist, label: 'Objetivos' },
    ];
    this.cantTradGraf = [
      { data: this.canttrad, label: 'Tradicional' },
      { data: this.objcanttrad, label: 'Objetivos' },
    ];
    this.cantDistGraf = [
      { data: this.cantdist, label: 'Distribuidores' },
      { data: this.objcantdist, label: 'Objetivos' },
    ];
    this.kgTradGraf = [
      { data: this.kgtrad, label: 'Tradicional' },
      { data: this.objkgtrad, label: 'Objetivos' },
    ];
    this.kgDistGraf = [
      { data: this.kgdist, label: 'Distribuidores' },
      { data: this.objkgdist, label: 'Objetivos' },
    ];
    this.arfvTradGraf = [
      { data: this.arfvtrad, label: 'Tradicional' },
      { data: this.objarfvtrad, label: 'Objetivos' },
    ];
    this.arfvDistGraf = [
      { data: this.arfvdist, label: 'Distribuidores' },
      { data: this.objarfvdist, label: 'Objetivos' },
    ];
    this.arfcTradGraf = [
      { data: this.arfctrad, label: 'Tradicional' },
      { data: this.objarfctrad, label: 'Objetivos' },
    ];
    this.arfcDistGraf = [
      { data: this.arfcdist, label: 'Distribuidores' },
      { data: this.objarfcdist, label: 'Objetivos' },
    ];
  }

  public lineChartLabels: Label[] = this.mes;
  public lineChartOptions: ChartOptions = {
    responsive: true,
  };
  public lineChartColors: Color[] = [
    {
      borderColor: 'blue',
      backgroundColor: 'rgba(57,68,188,0.6)',
    },
    {
      borderColor: 'grey',
      backgroundColor: 'rgba(69,120,142,0.3)',
    },
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [];
}
