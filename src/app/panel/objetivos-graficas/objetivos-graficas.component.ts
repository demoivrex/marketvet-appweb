import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';

@Component({
  selector: 'app-objetivos-graficas',
  templateUrl: './objetivos-graficas.component.html',
  styleUrls: ['./objetivos-graficas.component.css'],
})
export class ObjetivosGraficasComponent implements OnInit {
  mes1actual = null; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  mes2actual = null; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  mes3actual = null; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  mes1anterior = null; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  mes2anterior = null; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  mes3anterior = null; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE

  datosGrafico = {
    ventas: 0,
    cant: 0,
    kg: 0,
    ventasTrad: 0,
    cantTrad: 0,
    kgTrad: 0,
    ventasDist: 0,
    cantDist: 0,
    kgDist: 0,
  };
  xmlobj;
  mesGrafico = '01';
  anoGrafico = '2020'; //CAMBIARLO MANUALMENTE

  vendedor = '';
  ventas2020 = 0;
  ventas2021 = 0;
  ventasDif = 0;
  unidades2020 = 0;
  unidades2021 = 0;
  unidadesDif = 0;
  kg2020 = 0;
  kg2021 = 0;
  kgDif = 0;
  arfv2020 = 0;
  arfv2021 = 0;
  arfvDif = 0;
  arfu2020 = 0;
  arfu2021 = 0;
  arfuDif = 0;

  objetivos;

  mes: string = '04';
  ano: string = '2022';
  anop: string = '2021';

  constructor(private fb: FirebaseService) {}

  ngOnInit(): void {
    this.cargarObjetivos();
    this.asignarLabelGraficos();
  }

  cargarObjetivos() {
    let mes1 = '01';
    let mes2 = '02';
    let mes3 = '03';
    this.anop = '2021';
    if (this.ano == '2021') {
      this.anop = '2020';
    }
    if (this.mes == '04') {
      mes1 = '04';
      mes2 = '05';
      mes3 = '06';
    }
    if (this.mes == '07') {
      mes1 = '07';
      mes2 = '08';
      mes3 = '09';
    }
    if (this.mes == '10') {
      mes1 = '10';
      mes2 = '11';
      mes3 = '12';
    }
    this.cargarMeses(mes1, mes2, mes3);
  }

  cargarMeses(mes1, mes2, mes3) {
    this.fb.cargarDatosGraficas(mes1, this.ano).subscribe((resp1: any) => {
      this.mes1actual = resp1;
      this.cargarMes2(mes1, mes2, mes3);
    });
  }
  cargarMes2(mes1, mes2, mes3) {
    this.fb.cargarDatosGraficas(mes2, this.ano).subscribe((resp2: any) => {
      this.mes2actual = resp2;
      this.cargarMes3(mes1, mes2, mes3);
    });
  }
  cargarMes3(mes1, mes2, mes3) {
    this.fb.cargarDatosGraficas(mes3, this.ano).subscribe((resp3: any) => {
      this.mes3actual = resp3;
      this.cargarMes4(mes1, mes2, mes3);
    });
  }
  cargarMes4(mes1, mes2, mes3) {
    this.fb.cargarDatosGraficas(mes1, this.anop).subscribe((resp4: any) => {
      this.mes1anterior = resp4;
      this.cargarMes5(mes1, mes2, mes3);
    });
  }
  cargarMes5(mes1, mes2, mes3) {
    this.fb.cargarDatosGraficas(mes2, this.anop).subscribe((resp5: any) => {
      this.mes2anterior = resp5;
      this.cargarMes6(mes1, mes2, mes3);
    });
  }
  cargarMes6(mes1, mes2, mes3) {
    this.fb.cargarDatosGraficas(mes3, this.anop).subscribe((resp6: any) => {
      this.mes3anterior = resp6;
    });
  }

  calcularEmpresa(i: number) {
    if (i == 0) {
      this.vendedor = 'Vendedores';
      let ventas2020mes1 = this.mes1anterior.ventasTrad;
      let ventas2020mes2 = this.mes2anterior.ventasTrad;
      let ventas2020mes3 = this.mes3anterior.ventasTrad;
      let ventas2021mes1 = this.mes1actual.ventasTrad;
      let ventas2021mes2 = this.mes2actual.ventasTrad;
      let ventas2021mes3 = this.mes3actual.ventasTrad;
      let unidades2020mes1 = this.mes1anterior.cantTrad;
      let unidades2020mes2 = this.mes2anterior.cantTrad;
      let unidades2020mes3 = this.mes3anterior.cantTrad;
      let unidades2021mes1 = this.mes1actual.cantTrad;
      let unidades2021mes2 = this.mes2actual.cantTrad;
      let unidades2021mes3 = this.mes3actual.cantTrad;
      let kg2020mes1 = this.mes1anterior.kgTrad;
      let kg2020mes2 = this.mes2anterior.kgTrad;
      let kg2020mes3 = this.mes3anterior.kgTrad;
      let kg2021mes1 = this.mes1actual.kgTrad;
      let kg2021mes2 = this.mes2actual.kgTrad;
      let kg2021mes3 = this.mes3actual.kgTrad;

      this.ventas2021 =
        Number(ventas2021mes1) +
        Number(ventas2021mes2) +
        Number(ventas2021mes3);
      this.ventas2020 =
        Number(ventas2020mes1) +
        Number(ventas2020mes2) +
        Number(ventas2020mes3);
      this.ventasDif = Number(this.ventas2021) / Number(this.ventas2020) - 1;

      this.unidades2020 =
        Number(unidades2020mes1) +
        Number(unidades2020mes2) +
        Number(unidades2020mes3);
      this.unidades2021 =
        Number(unidades2021mes1) +
        Number(unidades2021mes2) +
        Number(unidades2021mes3);
      this.unidadesDif =
        Number(this.unidades2021) / Number(this.unidades2020) - 1;

      this.kg2020 =
        Number(kg2020mes1) + Number(kg2020mes2) + Number(kg2020mes3);
      this.kg2021 =
        Number(kg2021mes1) + Number(kg2021mes2) + Number(kg2021mes3);
      this.kgDif = Number(this.kg2021) / Number(this.kg2020) - 1;

      this.barChartVentas[0].data = [
        Math.trunc(ventas2020mes1),
        Math.trunc(ventas2020mes2),
        Math.trunc(ventas2020mes3),
      ];
      this.barChartVentas[1].data = [
        Math.trunc(ventas2021mes1),
        Math.trunc(ventas2021mes2),
        Math.trunc(ventas2021mes3),
      ];
      this.barChartUnidades[0].data = [
        Math.trunc(unidades2020mes1),
        Math.trunc(unidades2020mes2),
        Math.trunc(unidades2020mes3),
      ];
      this.barChartUnidades[1].data = [
        Math.trunc(unidades2021mes1),
        Math.trunc(unidades2021mes2),
        Math.trunc(unidades2021mes3),
      ];
      this.barChartKg[0].data = [
        Math.trunc(kg2020mes1),
        Math.trunc(kg2020mes2),
        Math.trunc(kg2020mes3),
      ];
      this.barChartKg[1].data = [
        Math.trunc(kg2021mes1),
        Math.trunc(kg2021mes2),
        Math.trunc(kg2021mes3),
      ];
    }
    if (i == 1) {
      this.vendedor = 'Distribuidora';
      let ventas2020mes1 = this.mes1anterior.ventasDist;
      let ventas2020mes2 = this.mes2anterior.ventasDist;
      let ventas2020mes3 = this.mes3anterior.ventasDist;
      let ventas2021mes1 = this.mes1actual.ventasDist;
      let ventas2021mes2 = this.mes2actual.ventasDist;
      let ventas2021mes3 = this.mes3actual.ventasDist;
      let unidades2020mes1 = this.mes1anterior.cantDist;
      let unidades2020mes2 = this.mes2anterior.cantDist;
      let unidades2020mes3 = this.mes3anterior.cantDist;
      let unidades2021mes1 = this.mes1actual.cantDist;
      let unidades2021mes2 = this.mes2actual.cantDist;
      let unidades2021mes3 = this.mes3actual.cantDist;
      let kg2020mes1 = this.mes1anterior.kgDist;
      let kg2020mes2 = this.mes2anterior.kgDist;
      let kg2020mes3 = this.mes3anterior.kgDist;
      let kg2021mes1 = this.mes1actual.kgDist;
      let kg2021mes2 = this.mes2actual.kgDist;
      let kg2021mes3 = this.mes3actual.kgDist;

      this.ventas2021 =
        Number(ventas2021mes1) +
        Number(ventas2021mes2) +
        Number(ventas2021mes3);
      this.ventas2020 =
        Number(ventas2020mes1) +
        Number(ventas2020mes2) +
        Number(ventas2020mes3);
      this.ventasDif = Number(this.ventas2021) / Number(this.ventas2020) - 1;

      this.unidades2020 =
        Number(unidades2020mes1) +
        Number(unidades2020mes2) +
        Number(unidades2020mes3);
      this.unidades2021 =
        Number(unidades2021mes1) +
        Number(unidades2021mes2) +
        Number(unidades2021mes3);
      this.unidadesDif =
        Number(this.unidades2021) / Number(this.unidades2020) - 1;

      this.kg2020 =
        Number(kg2020mes1) + Number(kg2020mes2) + Number(kg2020mes3);
      this.kg2021 =
        Number(kg2021mes1) + Number(kg2021mes2) + Number(kg2021mes3);
      this.kgDif = Number(this.kg2021) / Number(this.kg2020) - 1;

      this.barChartVentas[0].data = [
        Math.trunc(ventas2020mes1),
        Math.trunc(ventas2020mes2),
        Math.trunc(ventas2020mes3),
      ];
      this.barChartVentas[1].data = [
        Math.trunc(ventas2021mes1),
        Math.trunc(ventas2021mes2),
        Math.trunc(ventas2021mes3),
      ];
      this.barChartUnidades[0].data = [
        Math.trunc(unidades2020mes1),
        Math.trunc(unidades2020mes2),
        Math.trunc(unidades2020mes3),
      ];
      this.barChartUnidades[1].data = [
        Math.trunc(unidades2021mes1),
        Math.trunc(unidades2021mes2),
        Math.trunc(unidades2021mes3),
      ];
      this.barChartKg[0].data = [
        Math.trunc(kg2020mes1),
        Math.trunc(kg2020mes2),
        Math.trunc(kg2020mes3),
      ];
      this.barChartKg[1].data = [
        Math.trunc(kg2021mes1),
        Math.trunc(kg2021mes2),
        Math.trunc(kg2021mes3),
      ];
    }
    if (i == 2) {
      this.vendedor = 'Empresa';
      let ventas2020mes1 = this.mes1anterior.ventas;
      let ventas2020mes2 = this.mes2anterior.ventas;
      let ventas2020mes3 = this.mes3anterior.ventas;
      let ventas2021mes1 = this.mes1actual.ventas;
      let ventas2021mes2 = this.mes2actual.ventas;
      let ventas2021mes3 = this.mes3actual.ventas;
      let unidades2020mes1 = this.mes1anterior.cant;
      let unidades2020mes2 = this.mes2anterior.cant;
      let unidades2020mes3 = this.mes3anterior.cant;
      let unidades2021mes1 = this.mes1actual.cant;
      let unidades2021mes2 = this.mes2actual.cant;
      let unidades2021mes3 = this.mes3actual.cant;
      let kg2020mes1 = this.mes1anterior.kg;
      let kg2020mes2 = this.mes2anterior.kg;
      let kg2020mes3 = this.mes3anterior.kg;
      let kg2021mes1 = this.mes1actual.kg;
      let kg2021mes2 = this.mes2actual.kg;
      let kg2021mes3 = this.mes3actual.kg;

      for (let i = 0; i < this.mes1actual.length; i++) {
        ventas2020mes1 += Number(this.mes1anterior[i].ventas);
        ventas2020mes2 += Number(this.mes2anterior[i].ventas);
        ventas2020mes3 += Number(this.mes3anterior[i].ventas);
        ventas2021mes1 += Number(this.mes1actual[i].ventas);
        ventas2021mes2 += Number(this.mes2actual[i].ventas);
        ventas2021mes3 += Number(this.mes3actual[i].ventas);
        unidades2020mes1 += Number(this.mes1anterior[i].cant);
        unidades2020mes2 += Number(this.mes2anterior[i].cant);
        unidades2020mes3 += Number(this.mes3anterior[i].cant);
        unidades2021mes1 += Number(this.mes1actual[i].cant);
        unidades2021mes2 += Number(this.mes2actual[i].cant);
        unidades2021mes3 += Number(this.mes3actual[i].cant);
        kg2020mes1 += Number(this.mes1anterior[i].kg);
        kg2020mes2 += Number(this.mes2anterior[i].kg);
        kg2020mes3 += Number(this.mes3anterior[i].kg);
        kg2021mes1 += Number(this.mes1actual[i].kg);
        kg2021mes2 += Number(this.mes2actual[i].kg);
        kg2021mes3 += Number(this.mes3actual[i].kg);
      }

      this.ventas2021 =
        Number(ventas2021mes1) +
        Number(ventas2021mes2) +
        Number(ventas2021mes3);
      this.ventas2020 =
        Number(ventas2020mes1) +
        Number(ventas2020mes2) +
        Number(ventas2020mes3);
      this.ventasDif = Number(this.ventas2021) / Number(this.ventas2020) - 1;

      this.unidades2020 =
        Number(unidades2020mes1) +
        Number(unidades2020mes2) +
        Number(unidades2020mes3);
      this.unidades2021 =
        Number(unidades2021mes1) +
        Number(unidades2021mes2) +
        Number(unidades2021mes3);
      this.unidadesDif =
        Number(this.unidades2021) / Number(this.unidades2020) - 1;

      this.kg2020 =
        Number(kg2020mes1) + Number(kg2020mes2) + Number(kg2020mes3);
      this.kg2021 =
        Number(kg2021mes1) + Number(kg2021mes2) + Number(kg2021mes3);
      this.kgDif = Number(this.kg2021) / Number(this.kg2020) - 1;

      this.barChartVentas[0].data = [
        Math.trunc(ventas2020mes1),
        Math.trunc(ventas2020mes2),
        Math.trunc(ventas2020mes3),
      ];
      this.barChartVentas[1].data = [
        Math.trunc(ventas2021mes1),
        Math.trunc(ventas2021mes2),
        Math.trunc(ventas2021mes3),
      ];
      this.barChartUnidades[0].data = [
        Math.trunc(unidades2020mes1),
        Math.trunc(unidades2020mes2),
        Math.trunc(unidades2020mes3),
      ];
      this.barChartUnidades[1].data = [
        Math.trunc(unidades2021mes1),
        Math.trunc(unidades2021mes2),
        Math.trunc(unidades2021mes3),
      ];
      this.barChartKg[0].data = [
        Math.trunc(kg2020mes1),
        Math.trunc(kg2020mes2),
        Math.trunc(kg2020mes3),
      ];
      this.barChartKg[1].data = [
        Math.trunc(kg2021mes1),
        Math.trunc(kg2021mes2),
        Math.trunc(kg2021mes3),
      ];
    }
  }

  cargarDatosGraficos() {
    this.cargarObjetivos();
    this.asignarLabelGraficos();
  }

  // PROCESAMIENTO DE DATOS

  limpiarArreglo() {
    this.datosGrafico.ventas = 0;
    this.datosGrafico.cant = 0;
    this.datosGrafico.kg = 0;
    this.datosGrafico.ventasTrad = 0;
    this.datosGrafico.cantTrad = 0;
    this.datosGrafico.kgTrad = 0;
    this.datosGrafico.ventasDist = 0;
    this.datosGrafico.cantDist = 0;
    this.datosGrafico.kgDist = 0;
  }

  procesarXML() {
    const indice = this.xmlobj.indexOf('<ROWDATA>') + 9;
    const xmlTemp = this.xmlobj.substring(indice);
    let xml = xmlTemp.split('/>');
    this.limpiarArreglo();

    for (let i = 0; i < xml.length; i++) {
      const element = xml[i];
      let cpr = null;
      cpr = element.split('"');
      if (cpr.length == 39) {
        cpr.unshift('', '');
      }
      if (
        cpr.length == 41 &&
        cpr[11] != '5' &&
        cpr[11] != '4' &&
        cpr[11] != '999' &&
        cpr[11] != '9999' &&
        cpr[11] != '111'
      ) {
        this.calculosSumatorias(cpr);
      }
    }
    this.fb
      .actualizarDatosGraficas(
        this.datosGrafico,
        this.mesGrafico,
        this.anoGrafico
      )
      .subscribe();
  }

  calculosSumatorias(linea) {
    this.datosGrafico.ventas += Number(linea[31]);
    this.datosGrafico.cant += Number(linea[25]);
    this.datosGrafico.kg += Number(linea[29]);
    if (
      linea[1] == 'FUGAS ALFREDO RAUL' ||
      linea[1] == 'SPECTOR WALTER' ||
      linea[1] == 'EGEA WALTER'
    ) {
      this.datosGrafico.ventasDist += Number(linea[31]);
      this.datosGrafico.cantDist += Number(linea[25]);
      this.datosGrafico.kgDist += Number(linea[29]);
    } else {
      this.datosGrafico.ventasTrad += Number(linea[31]);
      this.datosGrafico.cantTrad += Number(linea[25]);
      this.datosGrafico.kgTrad += Number(linea[29]);
    }
  }

  //GRAFICOS

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartLabels: Label[] = ['Enero', 'Febrero', 'Marzo'];
  asignarLabelGraficos() {
    this.barChartLabels = ['Enero', 'Febrero', 'Marzo'];
    if (this.mes == '04') {
      this.barChartLabels = ['Abril', 'Mayo', 'Junio'];
    }
    if (this.mes == '07') {
      this.barChartLabels = ['Julio', 'Agosto', 'Septiembre'];
    }
    if (this.mes == '10') {
      this.barChartLabels = ['Octubre', 'Noviembre', 'Diciembre'];
    }
    this.barChartVentas = [
      { data: [0, 0, 0], label: this.anop },
      { data: [0, 0, 0], label: this.ano },
    ];
    this.barChartUnidades = [
      { data: [0, 0, 0], label: this.anop },
      { data: [0, 0, 0], label: this.ano },
    ];
    this.barChartKg = [
      { data: [0, 0, 0], label: this.anop },
      { data: [0, 0, 0], label: this.ano },
    ];
  }
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartVentas: ChartDataSets[] = [
    { data: [0, 0, 0], label: this.anop },
    { data: [0, 0, 0], label: this.ano },
  ];

  public barChartUnidades: ChartDataSets[] = [
    { data: [0, 0, 0], label: this.anop },
    { data: [0, 0, 0], label: this.ano },
  ];

  public barChartKg: ChartDataSets[] = [
    { data: [0, 0, 0], label: this.anop },
    { data: [0, 0, 0], label: this.ano },
  ];
}
