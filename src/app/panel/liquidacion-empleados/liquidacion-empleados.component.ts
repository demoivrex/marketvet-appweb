import { Component, OnInit } from '@angular/core';
import { Liquidacion } from 'src/app/models/liquidacion.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { PremiosService } from 'src/app/services/premios.service';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-liquidacion-empleados',
  templateUrl: './liquidacion-empleados.component.html',
  styleUrls: ['./liquidacion-empleados.component.css'],
})
export class LiquidacionEmpleadosComponent implements OnInit {
  mes: string = '01';
  ano: string = '2026';
  actualizar = false;
  seccionURL: string = this.router.url.slice(1);
  liquidaciones: Liquidacion[] = [];
  liquidacionesTabla: Liquidacion[] = [];
  listaAnios: string[] = [];
  listSectores: string[] = [];
  listTotales: number[] = [];
  liquidacionVista: Liquidacion;
  objetivosVista;
  verLiquidacionEmpleado: boolean = false;
  xmlliq;
  objetivos;
  rentabilidad;
  coefTrad: number;
  coefDist: number;
  ventasTrad: number;

  respaldo: Liquidacion[] = [];
  teniaData: boolean = false;

  totalDetalle: number;

  //TOTALES TABLA
  totalesTabla = {
    sueldo: 0,
    aguinaldo: 0,
    viaticos: 0,
    adelantos: 0,
    gastos: 0,
    premios: 0,
    adicionalPorKM: 0,
    total: 0,
  };

  constructor(private router: Router,
    private fb: FirebaseService,
    private premios: PremiosService,
    private liqService: LiquidacionService) { }

  ngOnInit(): void {
    this.obtenerFecha();
    this.obtenerSectores();
  }

  obtenerFecha() {
    const today = new Date();
    this.mes = ('0' + (today.getMonth() + 1)).slice(-2);
    this.ano = today.getFullYear().toString();

    for (let i = 2023; i <= Number(this.ano); i++) {
      this.listaAnios.push(i.toString());
    }
  }

  obtenerSectores() {
    this.fb.getSectores().subscribe((resp: any) => {
      this.listSectores = resp;
    });
  }

  cargarObjetivos() {
    this.fb.cargarObjetivos(this.mes, this.ano).subscribe((resp: any) => {
      this.objetivos = resp;
    });
    this.fb
      .cargarObjetivosEspeciales(this.mes, this.ano)
      .subscribe((resp: any) => {
        this.coefTrad = Number(resp[0].coeficiente.toFixed(2));
        this.ventasTrad = resp[0].ventastotales;
        this.coefDist = Number(resp[1].coeficiente.toFixed(2));
      });
  }

  cargarRentabilidad() {
    const mes = Number(this.mes).toString();
    this.fb.getRentabilidadVendedores(mes, this.ano)
      .subscribe((resp: any) => {
        this.rentabilidad = resp;
        console.log('RENTABILIDAD', this.rentabilidad);
        console.log('MES', mes);
        console.log('ANO', this.ano);
      });
  }

  buscarLiquidacion() {
    this.cargarObjetivos();
    this.cargarRentabilidad();
    this.fb.getLiquidacion(this.ano, this.mes).subscribe((resp: any) => {
      if (resp) {
        console.log("LIQUIDACION", resp);
        this.liquidaciones = resp;
        this.liquidacionesTabla = resp;
        this.listTotales = [];
        this.calcularTotalGeneral();
      } else {
        this.liquidaciones = this.liqService.generarLiquidacionMes(this.ano, this.mes);
        //Hay que hacer copias de los nombres porque mepa que se borra sino.
        this.liquidacionesTabla = this.liquidaciones;
      }
      this.calculoTotalesLiquidacion();
    });
  }

  respaldoLiquidacion() {
    this.respaldo = JSON.parse(JSON.stringify(this.liquidaciones));
    for (let i = 0; i < this.respaldo.length; i++) {
      if (this.respaldo[i].total) {
        this.teniaData = true;
        break;
      }
    }
  }

  actualizarLiquidacion() {
    this.calcularTotales();
    this.calculoTotalesLiquidacion();
    this.fb
      .saveLiquidacion(this.liquidaciones, this.ano, this.mes)
      .subscribe((resp) => {
        this.actualizar = !this.actualizar;
        this.liquidacionesTabla = this.liquidaciones;
      });
    this.calcularPremios();
  }

  calcularTotales() {
    for (let i = 0; i < this.liquidaciones.length; i++) {
      this.liquidaciones[i].total =
        Number(this.liquidaciones[i].sueldo) +
        Number(this.liquidaciones[i].aguinaldo) +
        Number(this.liquidaciones[i].gastos) +
        Number(this.liquidaciones[i].premios);
      Number(this.liquidaciones[i].adicionalPorKM);
    }
  }

  calcularPremios() {
    this.liquidaciones = this.premios.calcularPremios(
      this.liquidaciones,
      this.objetivos,
      this.rentabilidad,
      this.diasCalle,
    );
    this.fb.saveLiquidacion(this.liquidaciones, this.ano, this.mes).subscribe();
  }

  procesarXML() {
    this.limpiarCobranza();
    const indice = this.xmlliq.indexOf('<ROWDATA>') + 9;
    const xmlTemp = this.xmlliq.substring(indice);
    let xml = xmlTemp.split('/>');
    for (let i = 0; i < xml.length; i++) {
      const element = xml[i];
      let cpr = null;
      cpr = element.split('"');
      this.procesarComprobante(cpr);
    }
    this.calcularPremios();
  }

  limpiarCobranza() {
    for (let i = 0; i < this.liquidaciones.length; i++) {
      this.liquidaciones[i].cobranza = 0;
    }
  }

  procesarComprobante(cpr) {
    for (let i = 0; i < this.liquidaciones.length; i++) {
      if (this.liquidaciones[i].nombre == cpr[23]) {
        this.liquidaciones[i].cobranza +=
          Number(cpr[27]) +
          Number(cpr[29]) +
          Number(cpr[31]) +
          Number(cpr[33]) +
          Number(cpr[35]) +
          Number(cpr[37]) +
          Number(cpr[39]);
        break;
      }
    }
  }

  verLiquidacion(i: number) {
    this.liquidacionVista = this.liquidacionesTabla[i];
    this.objetivosVista = this.buscarObjetivoEmpleado(
      this.liquidacionVista.nombre,
      this.liquidacionVista.sector
    );
    this.verLiquidacionEmpleado = true;
    this.calcularTotalDetalle();
  }

  calcularTotalDetalle() {
    this.calcularPremios();
    let total: number = this.liquidacionVista.total;
    if (this.liquidacionVista.agregadosBasicos != undefined) {
      for (let i = 0; i < this.liquidacionVista.agregadosBasicos.length; i++) {
        total += this.liquidacionVista.sueldo * this.liquidacionVista.agregadosBasicos[i].coeficiente;
      }
    }
    if (this.liquidacionVista.sector === "LOGISTICA") {
      total += this.liquidacionVista.adicionalPorKM;
    }
    this.totalDetalle = total;
  }

  calcularTotalGeneral() {
    this.calcularPremios();
    for (let i = 0; i < this.liquidaciones.length; i++) {
      let total: number = this.liquidaciones[i].total;
      if (this.liquidaciones[i].agregadosBasicos != undefined) {
        for (let j = 0; j < this.liquidaciones[i].agregadosBasicos.length; j++) {
          total += this.liquidaciones[i].sueldo * this.liquidaciones[i].agregadosBasicos[j].coeficiente;
        }
      }
      if (this.liquidaciones[i].sector === "LOGISTICA") {
        total += this.liquidaciones[i].adicionalPorKM;
      }
      this.listTotales.push(total);
    }
  }

  buscarObjetivoEmpleado(nombre: string, sector: string): string {
    if (
      sector == 'CANAL TRADICIONAL' ||
      sector == 'CANAL DISTRIBUIDOR' ||
      sector == 'CANAL DIGITAL'
    ) {
      for (let i = 0; i < this.objetivos.length; i++) {
        if (this.objetivos[i].vendedor == nombre) {
          return this.objetivos[i];
        }
      }
    } else {
      return null;
    }
  }

  calculoTotalesLiquidacion() {
    this.limpiarTotalesTabla();
    for (let i = 0; i < this.liquidacionesTabla.length; i++) {
      this.totalesTabla.sueldo += this.liquidacionesTabla[i].sueldo;
      this.totalesTabla.aguinaldo += this.liquidacionesTabla[i].aguinaldo;
      this.totalesTabla.adelantos += this.liquidacionesTabla[i].adelantos;
      this.totalesTabla.gastos += this.liquidacionesTabla[i].gastos;
      this.totalesTabla.premios += this.liquidacionesTabla[i].premios;
      this.totalesTabla.adicionalPorKM += this.liquidacionesTabla[i].adicionalPorKM;
      this.totalesTabla.total += this.liquidacionesTabla[i].total;
    }
  }

  limpiarTotalesTabla() {
    this.totalesTabla = {
      sueldo: 0,
      aguinaldo: 0,
      viaticos: 0,
      adelantos: 0,
      gastos: 0,
      premios: 0,
      adicionalPorKM: 0,

      total: 0,
    };
  }

  verSector(sector: string) {
    this.liquidacionesTabla = this.liquidaciones.filter(
      (item) => item.sector == sector
    );
    this.calculoTotalesLiquidacion();
  }

  calcularAdicionalPorKM(index: number): number {
    const precioKm = this.liquidaciones[index].precioKm || 0;
    const totalkm = this.liquidaciones[index].totalkm || 0;

    // Calcula el adicional por KM y suma el 10%
    const adicionalPorKM = precioKm * totalkm + precioKm * totalkm * 0.1;

    // Actualiza el valor en el arreglo
    this.liquidaciones[index].adicionalPorKM = adicionalPorKM;

    return adicionalPorKM;
  }

  diasCalle =
    [
      {
        "vendedor": "ATTIE OROME AGUSTIN",
        "dias": 10
      },
      {
        "vendedor": "BEARZOTTI BRUNO",
        "dias": 40
      },
      {
        "vendedor": "BREARD MICAELA",
        "dias": 10
      },
      {
        "vendedor": "CORREA JOSE LAUTARO",
        "dias": 65
      },
      {
        "vendedor": "EGEA WALTER",
        "dias": 65
      },
      {
        "vendedor": "FUGAS ALFREDO RAUL",
        "dias": 65
      },
      {
        "vendedor": "GARCIA ARIEL",
        "dias": 65
      },
      {
        "vendedor": "JACOB GERMAN",
        "dias": 10
      },
      {
        "vendedor": "MAGNIN CYNTHIA",
        "dias": 65
      },
      {
        "vendedor": "MARKETVET SA",
        "dias": 8
      },
      {
        "vendedor": "NETTO FABIAN",
        "dias": 65
      },
      {
        "vendedor": "PERALTA JAVIER",
        "dias": 65
      },
      {
        "vendedor": "SILVESTRI MAXIMILIANO",
        "dias": 65
      },
      {
        "vendedor": "SPECTOR WALTER",
        "dias": 40
      }
    ]
}
