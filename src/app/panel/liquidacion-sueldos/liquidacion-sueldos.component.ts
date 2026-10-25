import { Component, OnInit } from '@angular/core';
import { PaljetService } from '../../services/paljet.service';
import { FirebaseService } from '../../services/firebase.service';
import { cpr } from 'src/app/models/cpr.model';
import Swal from 'sweetalert2';
import { CalculosService } from '../../services/calculos.service';

@Component({
  selector: 'app-liquidacion-sueldos',
  templateUrl: './liquidacion-sueldos.component.html',
  styleUrls: ['./liquidacion-sueldos.component.css'],
})
export class LiquidacionSueldosComponent implements OnInit {
  objetivos;
  objetivosEsp;
  items;
  visualizar: boolean = false;
  editar: boolean = false;
  especial: boolean = false;

  total: number = 0;
  efectivo: number = 0;

  xmlliq;
  objetivosVer;
  liquidacionVer;
  sumatoriasVer;
  cprVer: cpr = null;

  facturas: [any];

  mes: string = '07';
  ano: string = '2022';

  //VENDEDORES
  bonazola: number = 0;
  lBonazola;
  casafus: number = 0;
  lCasafus;
  chiardola: number = 0;
  lChiardola;
  estrada: number = 0;
  lEstrada;
  fugas: number = 0;
  lFugas;
  jacob: number = 0;
  lJacob;
  luque: number = 0;
  lLuque;
  milocco: number = 0;
  lMilocco;
  neto: number = 0;
  lNeto;
  spector: number = 0;
  lSpector;
  vila: number = 0;
  lVila;
  gambuzza: number = 0;
  lGambuzza;
  reynoso: number = 0;
  lReynoso;
  egea: number = 0;
  lEgea;

  //COMPROBANTES XML
  cprVila: cpr;
  cprFugas: cpr;
  cprNetto: cpr;
  cprJacob: cpr;
  cprBonazola: cpr;
  cprChiardola: cpr;
  cprLuque: cpr;
  cprMilocco: cpr;
  cprSpector: cpr;
  cprEstrada: cpr;
  cprCasafus: cpr;
  cprGambuzza: cpr;
  cprReynoso: cpr;
  cprEgea: cpr;
  cprArreglo: [cpr];

  constructor(private fb: FirebaseService, private calculo: CalculosService) {}

  ngOnInit(): void {
    this.obtenerFecha();
    this.cargarObjetivosEsp();
    this.cargarLiquidacion();
  }

  obtenerFecha() {
    const today = new Date();
    this.mes = ('0' + today.getMonth()).slice(-2);
  }

  cargarObjetivosEsp() {
    this.fb.cargarObjetivosEspeciales(this.mes, this.ano).subscribe((resp) => {
      this.objetivosEsp = resp;
    });
  }

  //CARGA SUELDO, AGUINALDO, PREMIOS, VIATICOS, ETC
  cargarLiquidacion() {
    this.fb.cargarLiquidacion(this.mes, this.ano).subscribe((resp) => {
      this.items = resp;
      this.cargarObjetivos();
    });
  }

  //CARGA LOS OBJETIVOS
  cargarObjetivos() {
    this.fb.cargarObjetivos(this.mes, this.ano).subscribe((resp) => {
      this.objetivos = resp;
      this.asignarObjetivos();
      this.cargarComisiones();
    });
  }

  //CARGA LAS COMISIONES DE LOS VENDEDORES
  cargarComisiones() {
    this.fb.cargarComisiones(this.mes, this.ano).subscribe((resp: any) => {
      this.cprArreglo = resp;
      this.asignarComisiones();
      Swal.close();
    });
  }

  asignarComisiones() {
    this.cprVila = new cpr();
    this.cprFugas = new cpr();
    this.cprNetto = new cpr();
    this.cprJacob = new cpr();
    this.cprBonazola = new cpr();
    this.cprChiardola = new cpr();
    this.cprLuque = new cpr();
    this.cprMilocco = new cpr();
    this.cprSpector = new cpr();
    this.cprEstrada = new cpr();
    this.cprCasafus = new cpr();
    this.cprGambuzza = new cpr();
    this.cprReynoso = new cpr();
    this.cprEgea = new cpr();
    if (this.cprArreglo.length > 0) {
      for (let i = 0; i < this.cprArreglo.length; i++) {
        if (this.cprArreglo[i].legajo == 1) {
          this.cprFugas = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 10) {
          this.cprVila = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 3) {
          this.cprNetto = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 5) {
          this.cprJacob = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 25) {
          this.cprBonazola = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 2) {
          this.cprChiardola = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 8) {
          this.cprLuque = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 4) {
          this.cprMilocco = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 22) {
          this.cprSpector = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 7) {
          this.cprEstrada = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 6) {
          this.cprCasafus = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 20) {
          this.cprGambuzza = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 31) {
          this.cprEgea = this.cprArreglo[i];
        }
        if (this.cprArreglo[i].legajo == 15) {
          this.cprReynoso = this.cprArreglo[i];
        }
      }
    }
    this.calcularPorcentajes();
  }

  buscarDatosLiquidacion() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando datos de liquidación',
      icon: 'info',
    });
    Swal.showLoading();
    this.cargarObjetivosEsp();
    this.cargarLiquidacion();
    this.cargarComisiones();
    this.cargarObjetivos();
  }

  asignarObjetivos() {
    for (let i = 0; i < this.objetivos.length; i++) {
      if (i == 5 || i == 8) {
        // CONDICIONES ESPECIALES
        if (i == 5) {
          this.objetivos[i].ObjVenta = 0;
          this.objetivos[i].ObjCant = 0;
          this.objetivos[i].ObjKg = 0;
          this.objetivos[i].ObjArfv = 0;
          this.objetivos[i].ObjArfc = 0;
        }
        if (i == 8) {
          this.objetivos[i].ObjVenta =
            this.calculo.asignarPorcentajeComisionEspecial(
              this.objetivos[i].ventasp
            );
          this.objetivos[i].ObjCant =
            this.calculo.asignarPorcentajeComisionEspecial(
              this.objetivos[i].cantp
            );
          this.objetivos[i].ObjKg =
            this.calculo.asignarPorcentajeComisionEspecial(
              this.objetivos[i].kgp
            );
          this.objetivos[i].ObjArfv =
            this.calculo.asignarPorcentajeComisionEspecial(
              this.objetivos[i].arfvp
            );
          this.objetivos[i].ObjArfc =
            this.calculo.asignarPorcentajeComisionEspecial(
              this.objetivos[i].arfcp
            );
        }
      } else {
        this.objetivos[i].ObjVenta = this.calculo.asignarPorcentajeComision(
          this.objetivos[i].ventasp
        );
        this.objetivos[i].ObjCant = this.calculo.asignarPorcentajeComision(
          this.objetivos[i].cantp
        );
        this.objetivos[i].ObjKg = this.calculo.asignarPorcentajeComision(
          this.objetivos[i].kgp
        );
        this.objetivos[i].ObjArfv = this.calculo.asignarPorcentajeComision(
          this.objetivos[i].arfvp
        );
        this.objetivos[i].ObjArfc = this.calculo.asignarPorcentajeComision(
          this.objetivos[i].arfcp
        );
      }
      if (
        this.objetivos[i].arfcp > 0.99 &&
        this.objetivos[i].arfvp > 0.99 &&
        this.objetivos[i].kgp > 0.99 &&
        this.objetivos[i].cantp > 0.99 &&
        this.objetivos[i].ventasp > 0.99
      ) {
        this.objetivos[i].cumple = true;
      } else {
        this.objetivos[i].cumple = false;
      }
    }
  }

  calcularPorcentajes() {
    //Estos dos salen del porcentaje de VentasTotales
    let premioVentasWalter;
    let premioVentasIvan;
    let porcentajeVentasWalter;
    let premioComisionVentas = this.objetivosEsp[0].ventastotales * 0.006;

    if (this.objetivosEsp[0].coeficiente < 0.85) {
      premioVentasIvan = 10000;
      porcentajeVentasWalter = 0.001;
      premioVentasWalter =
        this.objetivosEsp[0].ventastotales * porcentajeVentasWalter;
    }
    if (
      this.objetivosEsp[0].coeficiente < 0.95 &&
      this.objetivosEsp[0].coeficiente > 0.85
    ) {
      premioVentasIvan = 25000;
      porcentajeVentasWalter = 0.002;
      premioVentasWalter =
        this.objetivosEsp[0].ventastotales * porcentajeVentasWalter;
    }
    if (this.objetivosEsp[0].coeficiente > 0.95) {
      premioVentasIvan = 50000;
      porcentajeVentasWalter = 0.003;
      premioVentasWalter =
        this.objetivosEsp[0].ventastotales * porcentajeVentasWalter;
    }

    this.lVila = {
      vendedor: 'Vila',
      sueldo: this.items[1].sueldo,
      aguinaldo: this.items[1].aguinaldo,
      percObjetivoKg: this.objetivos[1].ObjKg,
      objetivoKg: this.cprVila.cobrado * this.objetivos[1].ObjKg,
      percObjetivoUn: this.objetivos[1].ObjCant,
      objetivoUn: this.cprVila.cobrado * this.objetivos[1].ObjCant,
      percObjetivoValor: this.objetivos[1].ObjVenta,
      objetivoValor: this.cprVila.cobrado * this.objetivos[1].ObjVenta,
      percObjetivoArfv: this.objetivos[1].ObjArfv,
      objetivoArfv: this.cprVila.cobrado * this.objetivos[1].ObjArfv,
      percObjetivoArfc: this.objetivos[1].ObjArfc,
      objetivoArfc: this.cprVila.cobrado * this.objetivos[1].ObjArfc,
      premios: this.items[1].premios,
      viaticos: this.items[1].viaticos,
      gastos: this.items[1].gastos,
      total:
        this.items[1].sueldo +
        this.items[1].aguinaldo +
        this.items[1].premios +
        this.items[1].gastos +
        this.cprVila.cobrado * this.objetivos[1].ObjKg +
        this.cprVila.cobrado * this.objetivos[1].ObjVenta +
        this.cprVila.cobrado * this.objetivos[1].ObjCant +
        this.cprVila.cobrado * this.objetivos[1].ObjArfv +
        this.cprVila.cobrado * this.objetivos[1].ObjArfc,
    };
    this.lFugas = {
      vendedor: 'Fugas',
      sueldo: this.items[0].sueldo,
      aguinaldo: this.items[0].aguinaldo,
      percObjetivoKg: this.objetivos[0].ObjKg,
      objetivoKg: this.cprFugas.cobrado * this.objetivos[0].ObjKg,
      percObjetivoUn: this.objetivos[0].ObjCant,
      objetivoUn: this.cprFugas.cobrado * this.objetivos[0].ObjCant,
      percObjetivoValor: this.objetivos[0].ObjVenta,
      objetivoValor: this.cprFugas.cobrado * this.objetivos[0].ObjVenta,
      percObjetivoArfv: this.objetivos[0].ObjArfv,
      objetivoArfv: this.cprFugas.cobrado * this.objetivos[0].ObjArfv,
      percObjetivoArfc: this.objetivos[0].ObjArfc,
      objetivoArfc: this.cprFugas.cobrado * this.objetivos[0].ObjArfc,
      premios: this.items[0].premios,
      viaticos: this.items[0].viaticos,
      gastos: this.items[0].gastos,
      total:
        this.items[0].sueldo +
        this.items[0].aguinaldo +
        this.items[0].premios +
        this.items[0].gastos +
        this.cprFugas.cobrado * this.objetivos[0].ObjKg +
        this.cprFugas.cobrado * this.objetivos[0].ObjCant +
        this.cprFugas.cobrado * this.objetivos[0].ObjVenta +
        this.cprFugas.cobrado * this.objetivos[0].ObjArfv +
        this.cprFugas.cobrado * this.objetivos[0].ObjArfc,
    };
    this.lNeto = {
      vendedor: 'Neto',
      sueldo: this.items[2].sueldo,
      aguinaldo: this.items[2].aguinaldo,
      percObjetivoKg: this.objetivos[2].ObjKg,
      objetivoKg: this.cprNetto.cobrado * this.objetivos[2].ObjKg,
      percObjetivoUn: this.objetivos[2].ObjCant,
      objetivoUn: this.cprNetto.cobrado * this.objetivos[2].ObjCant,
      percObjetivoValor: this.objetivos[2].ObjVenta,
      objetivoValor: this.cprNetto.cobrado * this.objetivos[2].ObjVenta,
      percObjetivoArfv: this.objetivos[2].ObjArfv,
      objetivoArfv: this.cprNetto.cobrado * this.objetivos[2].ObjArfv,
      percObjetivoArfc: this.objetivos[2].ObjArfc,
      objetivoArfc: this.cprNetto.cobrado * this.objetivos[2].ObjArfc,
      premios: this.items[2].premios,
      viaticos: this.items[2].viaticos,
      gastos: this.items[2].gastos,
      total:
        this.items[2].sueldo +
        this.items[2].aguinaldo +
        this.items[2].premios +
        this.items[2].gastos +
        this.cprNetto.cobrado * this.objetivos[2].ObjVenta +
        this.cprNetto.cobrado * this.objetivos[2].ObjCant +
        this.cprNetto.cobrado * this.objetivos[2].ObjKg +
        this.cprNetto.cobrado * this.objetivos[2].ObjArfv +
        this.cprNetto.cobrado * this.objetivos[2].ObjArfc,
    };
    this.lJacob = {
      vendedor: 'Jacob',
      sueldo: this.items[3].sueldo,
      aguinaldo: this.items[3].aguinaldo,
      percObjetivoKg: this.objetivos[3].ObjKg,
      objetivoKg: this.cprJacob.cobrado * this.objetivos[3].ObjKg,
      percObjetivoUn: this.objetivos[3].ObjCant,
      objetivoUn: this.cprJacob.cobrado * this.objetivos[3].ObjCant,
      percObjetivoValor: this.objetivos[3].ObjVenta,
      objetivoValor: this.cprJacob.cobrado * this.objetivos[3].ObjVenta,
      percObjetivoArfv: this.objetivos[3].ObjArfv,
      objetivoArfv: this.cprJacob.cobrado * this.objetivos[3].ObjArfv,
      percObjetivoArfc: this.objetivos[3].ObjArfc,
      objetivoArfc: this.cprJacob.cobrado * this.objetivos[3].ObjArfc,
      premios: this.items[3].premios,
      viaticos: this.items[3].viaticos,
      gastos: this.items[3].gastos,
      total:
        this.items[3].sueldo +
        this.items[3].aguinaldo +
        this.items[3].premios +
        this.items[3].gastos +
        this.cprJacob.cobrado * this.objetivos[3].ObjVenta +
        this.cprJacob.cobrado * this.objetivos[3].ObjCant +
        this.cprJacob.cobrado * this.objetivos[3].ObjKg +
        this.cprJacob.cobrado * this.objetivos[3].ObjArfv +
        this.cprJacob.cobrado * this.objetivos[3].ObjArfc,
    };
    this.lReynoso = {
      vendedor: 'Reynoso',
      sueldo: this.items[6].sueldo,
      aguinaldo: this.items[6].aguinaldo,
      percObjetivoKg: this.objetivos[6].ObjKg,
      objetivoKg: this.cprReynoso.cobrado * this.objetivos[6].ObjKg,
      percObjetivoUn: this.objetivos[6].ObjCant,
      objetivoUn: this.cprReynoso.cobrado * this.objetivos[6].ObjCant,
      percObjetivoValor: this.objetivos[6].ObjVenta,
      objetivoValor: this.cprReynoso.cobrado * this.objetivos[6].ObjVenta,
      percObjetivoArfv: this.objetivos[6].ObjArfv,
      objetivoArfv: this.cprReynoso.cobrado * this.objetivos[6].ObjArfv,
      percObjetivoArfc: this.objetivos[6].ObjArfc,
      objetivoArfc: this.cprReynoso.cobrado * this.objetivos[6].ObjArfc,
      premios: this.items[6].premios,
      viaticos: this.items[6].viaticos,
      gastos: this.items[6].gastos,
      total:
        this.items[6].sueldo +
        this.items[6].aguinaldo +
        this.items[6].premios +
        this.items[6].gastos +
        this.cprReynoso.cobrado * this.objetivos[6].ObjVenta +
        this.cprReynoso.cobrado * this.objetivos[6].ObjCant +
        this.cprReynoso.cobrado * this.objetivos[6].ObjKg +
        this.cprReynoso.cobrado * this.objetivos[6].ObjArfv +
        this.cprReynoso.cobrado * this.objetivos[6].ObjArfc,
    };
    this.lChiardola = {
      vendedor: 'Chiardola',
      sueldo: this.items[5].sueldo,
      aguinaldo: this.items[5].aguinaldo,
      percObjetivoKg: this.objetivos[5].ObjKg,
      objetivoKg: this.cprChiardola.cobrado * this.objetivos[5].ObjKg,
      percObjetivoUn: this.objetivos[5].ObjCant,
      objetivoUn: this.cprChiardola.cobrado * this.objetivos[5].ObjCant,
      percObjetivoValor: this.objetivos[5].ObjVenta,
      objetivoValor: this.cprChiardola.cobrado * this.objetivos[5].ObjVenta,
      percObjetivoArfv: this.objetivos[5].ObjArfv,
      objetivoArfv: this.cprChiardola.cobrado * this.objetivos[5].ObjArfv,
      percObjetivoArfc: this.objetivos[5].ObjArfc,
      objetivoArfc: this.cprChiardola.cobrado * this.objetivos[5].ObjArfc,
      objetivoVentasTotales: premioVentasIvan,
      premioComisionVentas: premioComisionVentas,
      percObjetivoVentasTotales: this.objetivosEsp[0].coeficiente,
      premios: this.items[5].premios,
      viaticos: this.items[5].viaticos,
      gastos: this.items[5].gastos,
      total:
        this.items[5].sueldo +
        this.items[5].aguinaldo +
        this.items[5].premios +
        this.items[5].gastos +
        this.cprChiardola.cobrado * this.objetivos[5].ObjVenta +
        this.cprChiardola.cobrado * this.objetivos[5].ObjCant +
        this.cprChiardola.cobrado * this.objetivos[5].ObjKg +
        this.cprChiardola.cobrado * this.objetivos[5].ObjArfv +
        this.cprChiardola.cobrado * this.objetivos[5].ObjArfc +
        premioVentasIvan +
        premioComisionVentas,
    };
    this.lGambuzza = {
      vendedor: 'Gambuzza',
      sueldo: this.items[4].sueldo,
      aguinaldo: this.items[4].aguinaldo,
      percObjetivoKg: this.objetivos[4].ObjKg,
      objetivoKg: this.cprGambuzza.cobrado * this.objetivos[4].ObjKg,
      percObjetivoUn: this.objetivos[4].ObjCant,
      objetivoUn: this.cprGambuzza.cobrado * this.objetivos[4].ObjCant,
      percObjetivoValor: this.objetivos[4].ObjVenta,
      objetivoValor: this.cprGambuzza.cobrado * this.objetivos[4].ObjVenta,
      percObjetivoArfv: this.objetivos[4].ObjArfv,
      objetivoArfv: this.cprGambuzza.cobrado * this.objetivos[4].ObjArfv,
      percObjetivoArfc: this.objetivos[4].ObjArfc,
      objetivoArfc: this.cprGambuzza.cobrado * this.objetivos[4].ObjArfc,
      premios: this.items[4].premios,
      viaticos: this.items[4].viaticos,
      gastos: this.items[4].gastos,
      total:
        this.items[4].sueldo +
        this.items[4].aguinaldo +
        this.items[4].premios +
        this.items[4].gastos +
        this.cprGambuzza.cobrado * this.objetivos[4].ObjVenta +
        this.cprGambuzza.cobrado * this.objetivos[4].ObjCant +
        this.cprGambuzza.cobrado * this.objetivos[4].ObjKg +
        this.cprGambuzza.cobrado * this.objetivos[4].ObjArfv +
        this.cprGambuzza.cobrado * this.objetivos[4].ObjArfc,
    };
    this.lMilocco = {
      vendedor: 'Milocco',
      sueldo: this.items[7].sueldo,
      aguinaldo: this.items[7].aguinaldo,
      percObjetivoKg: this.objetivos[7].ObjKg,
      objetivoKg: this.cprMilocco.cobrado * this.objetivos[7].ObjKg,
      percObjetivoUn: this.objetivos[7].ObjCant,
      objetivoUn: this.cprMilocco.cobrado * this.objetivos[7].ObjCant,
      percObjetivoValor: this.objetivos[7].ObjVenta,
      objetivoValor: this.cprMilocco.cobrado * this.objetivos[7].ObjVenta,
      percObjetivoArfv: this.objetivos[7].ObjArfv,
      objetivoArfv: this.cprMilocco.cobrado * this.objetivos[7].ObjArfv,
      percObjetivoArfc: this.objetivos[7].ObjArfc,
      objetivoArfc: this.cprMilocco.cobrado * this.objetivos[7].ObjArfc,
      premios: this.items[7].premios,
      viaticos: this.items[7].viaticos,
      gastos: this.items[7].gastos,
      total:
        this.items[7].sueldo +
        this.items[7].aguinaldo +
        this.items[7].premios +
        this.items[7].gastos +
        this.cprMilocco.cobrado * this.objetivos[7].ObjVenta +
        this.cprMilocco.cobrado * this.objetivos[7].ObjCant +
        this.cprMilocco.cobrado * this.objetivos[7].ObjKg +
        this.cprMilocco.cobrado * this.objetivos[7].ObjArfv +
        this.cprMilocco.cobrado * this.objetivos[7].ObjArfc,
    };
    this.lSpector = {
      vendedor: 'Spector',
      sueldo: this.items[8].sueldo,
      aguinaldo: this.items[8].aguinaldo,
      percObjetivoKg: this.objetivos[8].ObjKg,
      objetivoKg: this.cprSpector.cobrado * this.objetivos[8].ObjKg,
      percObjetivoUn: this.objetivos[8].ObjCant,
      objetivoUn: this.cprSpector.cobrado * this.objetivos[8].ObjCant,
      percObjetivoValor: this.objetivos[8].ObjVenta,
      objetivoValor: this.cprSpector.cobrado * this.objetivos[8].ObjVenta,
      percObjetivoArfv: this.objetivos[8].ObjArfv,
      objetivoArfv: this.cprSpector.cobrado * this.objetivos[8].ObjArfv,
      percObjetivoArfc: this.objetivos[8].ObjArfc,
      objetivoArfc: this.cprSpector.cobrado * this.objetivos[8].ObjArfc,
      objetivoVentasTotales: premioVentasWalter,
      percObjetivoVentasTotales: porcentajeVentasWalter,
      premios: this.items[8].premios,
      viaticos: this.items[8].viaticos,
      gastos: this.items[8].gastos,
      total:
        this.items[8].sueldo +
        this.items[8].aguinaldo +
        this.items[8].premios +
        this.items[8].gastos +
        this.cprSpector.cobrado * this.objetivos[8].ObjVenta +
        this.cprSpector.cobrado * this.objetivos[8].ObjCant +
        this.cprSpector.cobrado * this.objetivos[8].ObjKg +
        this.cprSpector.cobrado * this.objetivos[8].ObjArfv +
        this.cprSpector.cobrado * this.objetivos[8].ObjArfc +
        premioVentasWalter,
    };
    this.lEstrada = {
      vendedor: 'Estrada',
      sueldo: this.items[9].sueldo,
      aguinaldo: this.items[9].aguinaldo,
      percObjetivoKg: this.objetivos[9].ObjKg,
      objetivoKg: this.cprEstrada.cobrado * this.objetivos[9].ObjKg,
      percObjetivoUn: this.objetivos[9].ObjCant,
      objetivoUn: this.cprEstrada.cobrado * this.objetivos[9].ObjCant,
      percObjetivoValor: this.objetivos[9].ObjVenta,
      objetivoValor: this.cprEstrada.cobrado * this.objetivos[9].ObjVenta,
      percObjetivoArfv: this.objetivos[9].ObjArfv,
      objetivoArfv: this.cprEstrada.cobrado * this.objetivos[9].ObjArfv,
      percObjetivoArfc: this.objetivos[9].ObjArfc,
      objetivoArfc: this.cprEstrada.cobrado * this.objetivos[9].ObjArfc,
      premios: this.items[9].premios,
      viaticos: this.items[9].viaticos,
      gastos: this.items[9].gastos,
      total:
        this.items[9].sueldo +
        this.items[9].aguinaldo +
        this.items[9].premios +
        this.items[9].gastos +
        this.cprEstrada.cobrado * this.objetivos[9].ObjVenta +
        this.cprEstrada.cobrado * this.objetivos[9].ObjCant +
        this.cprEstrada.cobrado * this.objetivos[9].ObjKg +
        this.cprEstrada.cobrado * this.objetivos[9].ObjArfv +
        this.cprEstrada.cobrado * this.objetivos[9].ObjArfc,
    };
    this.lCasafus = {
      vendedor: 'Casafus',
      sueldo: this.items[10].sueldo,
      aguinaldo: this.items[10].aguinaldo,
      percObjetivoKg: this.objetivos[10].ObjKg,
      objetivoKg: this.cprCasafus.cobrado * this.objetivos[10].ObjKg,
      percObjetivoUn: this.objetivos[10].ObjCant,
      objetivoUn: this.cprCasafus.cobrado * this.objetivos[10].ObjCant,
      percObjetivoValor: this.objetivos[10].ObjVenta,
      objetivoValor: this.cprCasafus.cobrado * this.objetivos[10].ObjVenta,
      percObjetivoArfv: this.objetivos[10].ObjArfv,
      objetivoArfv: this.cprCasafus.cobrado * this.objetivos[10].ObjArfv,
      percObjetivoArfc: this.objetivos[10].ObjArfc,
      objetivoArfc: this.cprCasafus.cobrado * this.objetivos[10].ObjArfc,
      premios: this.items[10].premios,
      viaticos: this.items[10].viaticos,
      gastos: this.items[10].gastos,
      total:
        this.items[10].sueldo +
        this.items[10].aguinaldo +
        this.items[10].premios +
        this.items[10].gastos +
        this.cprCasafus.cobrado * this.objetivos[10].ObjVenta +
        this.cprCasafus.cobrado * this.objetivos[10].ObjCant +
        this.cprCasafus.cobrado * this.objetivos[10].ObjKg +
        this.cprCasafus.cobrado * this.objetivos[10].ObjArfv +
        this.cprCasafus.cobrado * this.objetivos[10].ObjArfc,
    };

    this.guardarComisiones();
  }

  guardarComisiones() {
    let comisiones: [cpr];
    comisiones = [this.cprFugas];
    comisiones.push(this.cprVila);
    comisiones.push(this.cprNetto);
    comisiones.push(this.cprJacob);
    comisiones.push(this.cprGambuzza);
    comisiones.push(this.cprChiardola);
    comisiones.push(this.cprReynoso);
    comisiones.push(this.cprMilocco);
    comisiones.push(this.cprSpector);
    comisiones.push(this.cprEstrada);
    comisiones.push(this.cprCasafus);
    this.fb.guardarComision(comisiones, this.mes, this.ano).subscribe();
  }

  guardarLiquidacion() {
    for (let index = 0; index < this.items.length; index++) {
      this.items[index].sueldo = Number(this.items[index].sueldo);
      this.items[index].aguinaldo = Number(this.items[index].aguinaldo);
      this.items[index].premios = Number(this.items[index].premios);
      this.items[index].viaticos = Number(this.items[index].viaticos);
      this.items[index].gastos = Number(this.items[index].gastos);
    }

    this.fb
      .actualizarLiquidacion(this.items, this.mes, this.ano)
      .subscribe((resp) => {
        this.editar = false;
      });
  }

  editarLiquidacion() {
    this.editar = true;
  }

  verLiquidacion(indice: number) {
    this.especial = false;
    this.efectivo = 0;
    this.total = 0;
    this.liquidacionVer = this.items[indice];
    this.objetivosVer = this.objetivos[indice];
    if (indice == 0) {
      this.sumatoriasVer = this.lFugas;
      this.cprVer = this.cprFugas;
    }
    if (indice == 1) {
      this.sumatoriasVer = this.lVila;
      this.cprVer = this.cprVila;
    }
    if (indice == 2) {
      this.sumatoriasVer = this.lNeto;
      this.cprVer = this.cprNetto;
    }
    if (indice == 3) {
      this.sumatoriasVer = this.lJacob;
      this.cprVer = this.cprJacob;
    }
    if (indice == 4) {
      this.sumatoriasVer = this.lGambuzza;
      this.cprVer = this.cprGambuzza;
    }
    if (indice == 5) {
      this.sumatoriasVer = this.lChiardola;
      this.cprVer = this.cprChiardola;
      this.especial = true;
    }
    if (indice == 6) {
      this.sumatoriasVer = this.lReynoso;
      this.cprVer = this.cprReynoso;
    }
    if (indice == 7) {
      this.sumatoriasVer = this.lMilocco;
      this.cprVer = this.cprMilocco;
    }
    if (indice == 8) {
      this.sumatoriasVer = this.lSpector;
      this.cprVer = this.cprSpector;
      this.especial = true;
    }
    if (indice == 9) {
      this.sumatoriasVer = this.lEstrada;
      this.cprVer = this.cprEstrada;
    }
    if (indice == 10) {
      this.sumatoriasVer = this.lCasafus;
      this.cprVer = this.cprCasafus;
    }
    this.efectivo =
      this.sumatoriasVer.total -
      this.liquidacionVer.adelanto -
      this.liquidacionVer.sueldo -
      this.liquidacionVer.aguinaldo;
    this.visualizar = true;
  }

  procesarNuevo() {
    this.cprVila = new cpr();
    this.cprFugas = new cpr();
    this.cprNetto = new cpr();
    this.cprJacob = new cpr();
    this.cprBonazola = new cpr();
    this.cprChiardola = new cpr();
    this.cprLuque = new cpr();
    this.cprMilocco = new cpr();
    this.cprSpector = new cpr();
    this.cprEstrada = new cpr();
    this.cprCasafus = new cpr();
    this.cprReynoso = new cpr();
    this.cprGambuzza = new cpr();
    this.cprEgea = new cpr();
    const indice = this.xmlliq.indexOf('<ROWDATA>') + 9;
    const xmlTemp = this.xmlliq.substring(indice);
    let xml = xmlTemp.split('/>');
    for (let i = 0; i < xml.length; i++) {
      const element = xml[i];
      let cpr = null;
      cpr = element.split('"');
      if (cpr[21] == '1') {
        this.cprFugas.legajo = 1;
        this.cprFugas.efectivoA = this.cprFugas.efectivoA + Number(cpr[27]);
        this.cprFugas.efectivoB = this.cprFugas.efectivoB + Number(cpr[29]);
        this.cprFugas.chequeA = this.cprFugas.chequeA + Number(cpr[31]);
        this.cprFugas.chequeB = this.cprFugas.chequeB + Number(cpr[33]);
        this.cprFugas.depositoA = this.cprFugas.depositoA + Number(cpr[35]);
        this.cprFugas.depositoB = this.cprFugas.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '10') {
        this.cprVila.legajo = 10;
        this.cprVila.efectivoA = this.cprVila.efectivoA + Number(cpr[27]);
        this.cprVila.efectivoB = this.cprVila.efectivoB + Number(cpr[29]);
        this.cprVila.chequeA = this.cprVila.chequeA + Number(cpr[31]);
        this.cprVila.chequeB = this.cprVila.chequeB + Number(cpr[33]);
        this.cprVila.depositoA = this.cprVila.depositoA + Number(cpr[35]);
        this.cprVila.depositoB = this.cprVila.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '3') {
        this.cprNetto.legajo = 3;
        this.cprNetto.efectivoA = this.cprNetto.efectivoA + Number(cpr[27]);
        this.cprNetto.efectivoB = this.cprNetto.efectivoB + Number(cpr[29]);
        this.cprNetto.chequeA = this.cprNetto.chequeA + Number(cpr[31]);
        this.cprNetto.chequeB = this.cprNetto.chequeB + Number(cpr[33]);
        this.cprNetto.depositoA = this.cprNetto.depositoA + Number(cpr[35]);
        this.cprNetto.depositoB = this.cprNetto.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '5') {
        this.cprJacob.legajo = 5;
        this.cprJacob.efectivoA = this.cprJacob.efectivoA + Number(cpr[27]);
        this.cprJacob.efectivoB = this.cprJacob.efectivoB + Number(cpr[29]);
        this.cprJacob.chequeA = this.cprJacob.chequeA + Number(cpr[31]);
        this.cprJacob.chequeB = this.cprJacob.chequeB + Number(cpr[33]);
        this.cprJacob.depositoA = this.cprJacob.depositoA + Number(cpr[35]);
        this.cprJacob.depositoB = this.cprJacob.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '25') {
        this.cprBonazola.legajo = 25;
        this.cprBonazola.efectivoA =
          this.cprBonazola.efectivoA + Number(cpr[27]);
        this.cprBonazola.efectivoB =
          this.cprBonazola.efectivoB + Number(cpr[29]);
        this.cprBonazola.chequeA = this.cprBonazola.chequeA + Number(cpr[31]);
        this.cprBonazola.chequeB = this.cprBonazola.chequeB + Number(cpr[33]);
        this.cprBonazola.depositoA =
          this.cprBonazola.depositoA + Number(cpr[35]);
        this.cprBonazola.depositoB =
          this.cprBonazola.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '2') {
        this.cprChiardola.legajo = 2;
        this.cprChiardola.efectivoA =
          this.cprChiardola.efectivoA + Number(cpr[27]);
        this.cprChiardola.efectivoB =
          this.cprChiardola.efectivoB + Number(cpr[29]);
        this.cprChiardola.chequeA = this.cprChiardola.chequeA + Number(cpr[31]);
        this.cprChiardola.chequeB = this.cprChiardola.chequeB + Number(cpr[33]);
        this.cprChiardola.depositoA =
          this.cprChiardola.depositoA + Number(cpr[35]);
        this.cprChiardola.depositoB =
          this.cprChiardola.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '8') {
        this.cprLuque.legajo = 8;
        this.cprLuque.efectivoA = this.cprLuque.efectivoA + Number(cpr[27]);
        this.cprLuque.efectivoB = this.cprLuque.efectivoB + Number(cpr[29]);
        this.cprLuque.chequeA = this.cprLuque.chequeA + Number(cpr[31]);
        this.cprLuque.chequeB = this.cprLuque.chequeB + Number(cpr[33]);
        this.cprLuque.depositoA = this.cprLuque.depositoA + Number(cpr[35]);
        this.cprLuque.depositoB = this.cprLuque.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '4') {
        this.cprMilocco.legajo = 4;
        this.cprMilocco.efectivoA = this.cprMilocco.efectivoA + Number(cpr[27]);
        this.cprMilocco.efectivoB = this.cprMilocco.efectivoB + Number(cpr[29]);
        this.cprMilocco.chequeA = this.cprMilocco.chequeA + Number(cpr[31]);
        this.cprMilocco.chequeB = this.cprMilocco.chequeB + Number(cpr[33]);
        this.cprMilocco.depositoA = this.cprMilocco.depositoA + Number(cpr[35]);
        this.cprMilocco.depositoB = this.cprMilocco.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '22') {
        this.cprSpector.legajo = 22;
        this.cprSpector.efectivoA = this.cprSpector.efectivoA + Number(cpr[27]);
        this.cprSpector.efectivoB = this.cprSpector.efectivoB + Number(cpr[29]);
        this.cprSpector.chequeA = this.cprSpector.chequeA + Number(cpr[31]);
        this.cprSpector.chequeB = this.cprSpector.chequeB + Number(cpr[33]);
        this.cprSpector.depositoA = this.cprSpector.depositoA + Number(cpr[35]);
        this.cprSpector.depositoB = this.cprSpector.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '7') {
        this.cprEstrada.legajo = 7;
        this.cprEstrada.efectivoA = this.cprEstrada.efectivoA + Number(cpr[27]);
        this.cprEstrada.efectivoB = this.cprEstrada.efectivoB + Number(cpr[29]);
        this.cprEstrada.chequeA = this.cprEstrada.chequeA + Number(cpr[31]);
        this.cprEstrada.chequeB = this.cprEstrada.chequeB + Number(cpr[33]);
        this.cprEstrada.depositoA = this.cprEstrada.depositoA + Number(cpr[35]);
        this.cprEstrada.depositoB = this.cprEstrada.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '6') {
        this.cprCasafus.legajo = 6;
        this.cprCasafus.efectivoA = this.cprCasafus.efectivoA + Number(cpr[27]);
        this.cprCasafus.efectivoB = this.cprCasafus.efectivoB + Number(cpr[29]);
        this.cprCasafus.chequeA = this.cprCasafus.chequeA + Number(cpr[31]);
        this.cprCasafus.chequeB = this.cprCasafus.chequeB + Number(cpr[33]);
        this.cprCasafus.depositoA = this.cprCasafus.depositoA + Number(cpr[35]);
        this.cprCasafus.depositoB = this.cprCasafus.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '20') {
        this.cprGambuzza.legajo = 20;
        this.cprGambuzza.efectivoA =
          this.cprGambuzza.efectivoA + Number(cpr[27]);
        this.cprGambuzza.efectivoB =
          this.cprGambuzza.efectivoB + Number(cpr[29]);
        this.cprGambuzza.chequeA = this.cprGambuzza.chequeA + Number(cpr[31]);
        this.cprGambuzza.chequeB = this.cprGambuzza.chequeB + Number(cpr[33]);
        this.cprGambuzza.depositoA =
          this.cprGambuzza.depositoA + Number(cpr[35]);
        this.cprGambuzza.depositoB =
          this.cprGambuzza.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '15') {
        this.cprReynoso.legajo = 15;
        this.cprReynoso.efectivoA = this.cprReynoso.efectivoA + Number(cpr[27]);
        this.cprReynoso.efectivoB = this.cprReynoso.efectivoB + Number(cpr[29]);
        this.cprReynoso.chequeA = this.cprReynoso.chequeA + Number(cpr[31]);
        this.cprReynoso.chequeB = this.cprReynoso.chequeB + Number(cpr[33]);
        this.cprReynoso.depositoA = this.cprReynoso.depositoA + Number(cpr[35]);
        this.cprReynoso.depositoB = this.cprReynoso.depositoB + Number(cpr[37]);
      }
      if (cpr[21] == '31') {
        this.cprEgea.legajo = 31;
        this.cprEgea.efectivoA = this.cprEgea.efectivoA + Number(cpr[27]);
        this.cprEgea.efectivoB = this.cprEgea.efectivoB + Number(cpr[29]);
        this.cprEgea.chequeA = this.cprEgea.chequeA + Number(cpr[31]);
        this.cprEgea.chequeB = this.cprEgea.chequeB + Number(cpr[33]);
        this.cprEgea.depositoA = this.cprEgea.depositoA + Number(cpr[35]);
        this.cprEgea.depositoB = this.cprEgea.depositoB + Number(cpr[37]);
      }
    }
    this.procesarTotales();
  }

  procesarTotales() {
    this.cprFugas.total = this.calculo.asignarTotal(this.cprFugas);
    this.cprFugas.cobrado = this.calculo.asignarCobrado(this.cprFugas);

    this.cprVila.total = this.calculo.asignarTotal(this.cprVila);
    this.cprVila.cobrado = this.calculo.asignarCobrado(this.cprVila);

    this.cprNetto.total = this.calculo.asignarTotal(this.cprNetto);
    this.cprNetto.cobrado = this.calculo.asignarCobrado(this.cprNetto);

    this.cprJacob.total = this.calculo.asignarTotal(this.cprJacob);
    this.cprJacob.cobrado = this.calculo.asignarCobrado(this.cprJacob);

    this.cprBonazola.total = this.calculo.asignarTotal(this.cprBonazola);
    this.cprBonazola.cobrado = this.calculo.asignarCobrado(this.cprBonazola);

    this.cprChiardola.total = this.calculo.asignarTotal(this.cprChiardola);
    this.cprChiardola.cobrado = this.calculo.asignarCobrado(this.cprChiardola);

    this.cprLuque.total = this.calculo.asignarTotal(this.cprLuque);
    this.cprLuque.cobrado = this.calculo.asignarCobrado(this.cprLuque);

    this.cprMilocco.total = this.calculo.asignarTotal(this.cprMilocco);
    this.cprMilocco.cobrado = this.calculo.asignarCobrado(this.cprMilocco);

    this.cprSpector.total = this.calculo.asignarTotal(this.cprSpector);
    this.cprSpector.cobrado = this.calculo.asignarCobrado(this.cprSpector);

    this.cprEstrada.total = this.calculo.asignarTotal(this.cprEstrada);
    this.cprEstrada.cobrado = this.calculo.asignarCobrado(this.cprEstrada);

    this.cprCasafus.total = this.calculo.asignarTotal(this.cprCasafus);
    this.cprCasafus.cobrado = this.calculo.asignarCobrado(this.cprCasafus);

    this.cprGambuzza.total = this.calculo.asignarTotal(this.cprGambuzza);
    this.cprGambuzza.cobrado = this.calculo.asignarCobrado(this.cprGambuzza);

    this.cprReynoso.total = this.calculo.asignarTotal(this.cprReynoso);
    this.cprReynoso.cobrado = this.calculo.asignarCobrado(this.cprReynoso);

    this.cprEgea.total = this.calculo.asignarTotal(this.cprEgea);
    this.cprEgea.cobrado = this.calculo.asignarCobrado(this.cprEgea);

    this.objetivosEsp[0].ventastotales =
      this.cprVila.cobrado +
      this.cprJacob.cobrado +
      this.cprNetto.cobrado +
      this.cprGambuzza.cobrado +
      this.cprChiardola.cobrado +
      this.cprReynoso.cobrado +
      this.cprMilocco.cobrado +
      this.cprEstrada.cobrado +
      this.cprCasafus.cobrado;
    this.objetivosEsp[1].ventastotales =
      this.cprFugas.cobrado + this.cprSpector.cobrado + this.cprEgea.cobrado;

    this.fb
      .actualizarObjetivosEspeciales(this.objetivosEsp, this.mes, this.ano)
      .subscribe((resp) => {
      });

    this.calcularPorcentajes();
  }

  //FUNCIONES AUXILIARES
  calcularTotalesTemp() {
    let sumatoria: number = 0;
    for (let index = 0; index < this.cprArreglo.length; index++) {
      if (index == 0 || index == 8 || index == 11) {
      } else {
        sumatoria =
          Number(sumatoria) +
          Number(this.cprArreglo[index].efectivoA) +
          Number(this.cprArreglo[index].efectivoB) +
          Number(this.cprArreglo[index].chequeA) +
          Number(this.cprArreglo[index].chequeB) +
          Number(this.cprArreglo[index].chequeA) +
          Number(this.cprArreglo[index].chequeB);
      }
    }
  }
}
