import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import Swal from 'sweetalert2';
import { CalculosService } from '../../services/calculos.service';
import { UtilService } from 'src/app/services/util.service';
import { ObjetivosService } from 'src/app/services/objetivos.service';
import { AdministracionGuard } from 'src/app/guards/administracion.guard';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-objetivos',
  templateUrl: './objetivos.component.html',
  styleUrls: ['./objetivos.component.css'],
})
export class ObjetivosComponent implements OnInit {
  objetivos; //ARREGLO CON LOS OBJETIVOS LEVANTADOS DE FIREBASE
  objetivosEsp; //ARREGLO CON LOS OBJETIVOS ESPECIALES DE DEPOSITO Y LOGISTICA
  objTradicional; //ARREGLO FILTRADO CON LOS OBJETIVOS DEL CANAL TRADICIONAL
  objDistribuidores; //ARREGLO FILTRADO CON LOS OBJETIVOS DEL CANAL DISTRIBUIDORES
  objDigitales; //ARREGLO FILTRADO CON LOS OBJETIVOS DEL CANAL DIGITALES
  xmlobj;

  dd: number; //dia para el calculo de los objetivos ponderados
  listaAnios: string[] = [];
  mes: string;
  ano: string;

  sumatoriasMes;
  accesoEdicion: boolean = false;

  //Variables Modal
  mesesTrimestre: string[] = [];
  mesModal: string;
  vendedorModal: string;
  cantModal: number = 0;
  kgModal: number = 0;
  ventasModal: number = 0;
  clienteModal: string;
  tabActiva: Number = 0;

  vendedoresSelect: any[];

  seccionURL: string = this.router.url.slice(1);

  constructor(private router: Router, private LOG: LogService, private fb: FirebaseService, private calculos: CalculosService, private utilidades: UtilService, private objetService: ObjetivosService, private AdminCheck: AdministracionGuard) {
  }

  ngOnInit(): void {
    this.obtenerFecha();
    this.objetivo();
    this.sumatorias();

    this.accesoEdicion = this.AdminCheck.accesoEdicionObjetivos();
  }

  obtenerFecha() {
    const today = new Date();
    this.mes = ('0' + (today.getMonth() + 1)).slice(-2);
    this.ano = today.getFullYear().toString();
    this.dd = today.getDate() - 1;

    for (let i = 2021; i <= Number(this.ano); i++) {
      this.listaAnios.push(i.toString());
    }

    switch (Number(this.mes)) {
      case 1:
      case 2:
      case 3:
        this.mesModal = '02'
        break;
      case 4:
      case 5:
      case 6:
        this.mesModal = '05'
        break;
      case 7:
      case 8:
      case 9:
        this.mesModal = '08'
        break;
      default:
        this.mesModal = '11'
        break;
    }
  }

  objetivo() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando datos de objetivos',
      icon: 'info',
    });
    Swal.showLoading();
    //carga objetivos normales
    this.fb.cargarObjetivos(this.mes, this.ano).subscribe((resp: any) => {
      this.objetivos = resp;
      this.separarObjetivos();
      //carga objetivos especiales
      this.fb
        .cargarObjetivosEspeciales(this.mes, this.ano)
        .subscribe((resp: any) => {
          this.objetivosEsp = resp;
        });
    });

    Swal.close();
  }

  sumatorias() {
    this.fb.cargarSumatorias(this.mes, this.ano).subscribe((resp: any) => {
      this.sumatoriasMes = resp;
    });
  }

  actualizarObjetivos() {
    this.procesarObjetivos();
    this.fb
      .actualizarObjetivos(this.objetivos, this.mes, this.ano)
      .subscribe((resp) => { });
    this.separarObjetivos();
    this.calcularCoeficientesCanales();
  }

  buscarDatosObjetivos() {
    this.objetivo();
    this.sumatorias();
  }

  procesarObjetivos() {
    for (let i = 0; i < this.objetivos.length; i++) {
      this.objetivos[i].ventasp =
        this.objetivos[i].ventas / ((this.objetivos[i].ventasobj * this.dd) / this.utilidades.obtenerDiasMesPorAno(Number(this.ano), Number(this.mes)));
      this.objetivos[i].cantp =
        this.objetivos[i].cant / ((this.objetivos[i].cantobj * this.dd) / this.utilidades.obtenerDiasMesPorAno(Number(this.ano), Number(this.mes)));
      this.objetivos[i].kgp =
        this.objetivos[i].kg / ((this.objetivos[i].kgobj * this.dd) / this.utilidades.obtenerDiasMesPorAno(Number(this.ano), Number(this.mes)));
      this.objetivos[i].coeficiente =
        (this.objetivos[i].ventasp +
          this.objetivos[i].cantp +
          this.objetivos[i].kgp) / 3;
    }
    this.guardarSumatoriaDia();
  }

  separarObjetivos() {
    if (this.objetivos != undefined) {
      this.objDigitales = this.objetivos.filter(
        (item) => item.canal == 'digital'
      );
      this.objTradicional = this.objetivos.filter(
        (item) => item.canal == 'tradicional'
      );
      this.objDistribuidores = this.objetivos.filter(
        (item) => item.canal == 'distribuidores'
      );
    }
  }

  calcularCoeficientesCanales() {
    this.objetivosEsp[0].coeficiente = this.calculos.asignarCoeficienteCanal(
      this.objTradicional
    );
    this.objetivosEsp[1].coeficiente = this.calculos.asignarCoeficienteCanal(
      this.objDistribuidores
    );
    this.fb
      .actualizarObjetivosEspeciales(this.objetivosEsp, this.mes, this.ano)
      .subscribe();
  }

  limpiarObjetivos() {
    for (let i = 0; i < this.objetivos.length; i++) {
      this.objetivos[i].ventas = 0;
      this.objetivos[i].cant = 0;
      this.objetivos[i].kg = 0;
      this.objetivos[i].arfv = 0;
      this.objetivos[i].arfc = 0;
    }
  }

  limpiarDigital(i) {
    this.objetivos[i].ventasDigital = 0;
    this.objetivos[i].ventasDistribuidor = 0;
    this.objetivos[i].ventasVendedores[0].netto = 0;
    this.objetivos[i].ventasVendedores[0].jacob = 0;
    this.objetivos[i].ventasVendedores[0].bearzotti = 0;
    this.objetivos[i].ventasVendedores[0].peralta = 0;
    this.objetivos[i].ventasVendedores[0].attie = 0;
    this.objetivos[i].ventasVendedores[0].silvestri = 0;
    this.objetivos[i].ventasVendedores[0].garcia = 0;
    this.objetivos[i].ventasVendedores[0].correa = 0;
    this.objetivos[i].ventasVendedores[0].fugas = 0;
    this.objetivos[i].ventasVendedores[0].spector = 0;
    this.objetivos[i].ventasVendedores[0].egea = 0;
    this.objetivos[i].ventasVendedores[0].breard = 0;
    this.objetivos[i].ventasVendedores[0].magnin = 0;
  }

  sumatoriaObjetivos(linea: any, i: number) {
    this.objetivos[i].ventas = Number(this.objetivos[i].ventas) + Number(linea.ventas);
    this.objetivos[i].cant = Number(this.objetivos[i].cant) + Number(linea.unidades);
    this.objetivos[i].kg = Number(this.objetivos[i].kg) + Number(linea.kilos);
    this.objetivos[i].arfv = Number(this.objetivos[i].arfv) + Number(linea.arfv);
    this.objetivos[i].arfc = Number(this.objetivos[i].arfc) + Number(linea.arfc);
  }

  sumatoriaDigital(linea: any, i: number) {

    switch (linea.vendedorCliente) {
      case 'NETTO FABIAN':
        this.objetivos[i].ventasVendedores[0].netto += Number(linea.ventas);
        break;
      case 'JACOB GERMAN':
        this.objetivos[i].ventasVendedores[0].jacob += Number(linea.ventas);
        break;
      case 'GAMBUZZA MATIAS':
        this.objetivos[i].ventasVendedores[0].gambuzza += Number(linea.ventas);
        break;
      case 'CHIARDOLA IVAN':
        this.objetivos[i].ventasVendedores[0].chiardola += Number(linea.ventas);
        break;
      case 'ESTRADA MARCELO':
        this.objetivos[i].ventasVendedores[0].estrada += Number(linea.ventas);
        break;
      case 'BEARZOTTI BRUNO':
        this.objetivos[i].ventasVendedores[0].bearzotti += Number(linea.ventas);
        break;
      case 'BREARD MICAELA':
        this.objetivos[i].ventasVendedores[0].breard += Number(linea.ventas);
        break;
      case 'BANOVSKY NATALIA':
        this.objetivos[i].ventasVendedores[0].banovsky += Number(linea.ventas);
        break;
      case 'PERALTA JAVIER':
        this.objetivos[i].ventasVendedores[0].peralta += Number(linea.ventas);
        break;
      case 'MAGNIN CYNTHIA':
        this.objetivos[i].ventasVendedores[0].magnin += Number(linea.ventas);
        break;
      case 'ATTIE OROME AGUSTIN':
        this.objetivos[i].ventasVendedores[0].attie += Number(linea.ventas);
        break;
      case 'SILVESTRI MAXIMILIANO':
        this.objetivos[i].ventasVendedores[0].silvestri += Number(linea.ventas);
        break;
      case 'GARCIA ARIEL':
        this.objetivos[i].ventasVendedores[0].garcia += Number(linea.ventas);
        break;
      case 'CORREA JOSE LAUTARO':
        this.objetivos[i].ventasVendedores[0].correa += Number(linea.ventas);
        break;
    }
    if (linea.vendedorCliente != "FUGAS ALFREDO RAUL"
      && linea.vendedorCliente != "SPECTOR WALTER"
      && linea.vendedorCliente != "EGEA WALTER") {
      this.objetivos[i].ventasDigital += Number(linea.ventas);
    }
    if (linea.vendedorCliente == "FUGAS ALFREDO RAUL") {
      this.verificarClienteDistribuidor(linea, i);
    }
  }

  verificarClienteDistribuidor(linea: any, i: number) {
    const clientesDistribuidor = [
      'C3 SUR SA',
      '*** ERRE ***',
      'ACCESORIOS ROCO S. R. L.',
      'AVI DISTRIBUCIONES S. A.',
      'BENITEZ SILVIO ANTONIO',
      'BERTUZZI EDUARDO',
      'CARRADORI CARLOS FABIAN',
      'CARRASCO LUIS RODOLFO',
      'CICCHITTI ARIEL',
      'CORDA VALERIA',
      'DIPORA SRL',
      'DISTRIBUIDORA ERRE SRL',
      'DISTRIBUIDORA M.A.S. SRL',
      'FAGOTTI ROBERTO JOSE',
      'J Y R DISTRIBUCIONES SRL',
      'LANZI CINTIA',
      'LANZILLOTTA JULIAN OMAR',
      'OMD DISTRIBUCIONES S. A.',
      'TENTOR JORGE GUILLERMO',
      'TRILLO LUIS HERNAN',
      'ZONAS ARIDAS ANIMAL SRL',
      'MENDOVET DE PRO M DISTRIBUCIONES SAS',
      'MENUTTI FERNANDO EUGENIO',
      'CARRASCO SANTIAGO',
      'BAGUFE S.A.S.',
      'GONZALEZ FABIAN ALEJANDRO',
      'ROJAS ARIEL LEONARDO'
    ];

    if (clientesDistribuidor.includes(linea.cliente)) {
      this.objetivos[i].ventasDistribuidor += Number(linea.ventas);
    }
  }

  procesarXML() {
    return this.xmlobj
      .substring(this.xmlobj.indexOf('<ROWDATA>') + 9)
      .split('/>')
      .map((item, i) => {
        var itemTemp = item.split('"');
        if (itemTemp.length == 39) {
          itemTemp.unshift('', '');
        }
        console.log(itemTemp);
        if (itemTemp[11] !== '3' && itemTemp[11] !== '4' && itemTemp[11] !== '1003' && itemTemp[11] !== '1004') {
          return {
            'vendedorCliente': itemTemp[1],
            'vendedorComprobante': itemTemp[3],
            'cliente': itemTemp[7],
            'ventas': Number(itemTemp[31]),
            'unidades': Number(itemTemp[25]),
            'kilos': Number(itemTemp[29]),
            'arfv': Number(itemTemp[35]),
            'arfc': Number(itemTemp[33])
          }
        }
      })
      .filter(function (item) {
        console.log(item)
        return item != undefined;
      });
  }

  procesarXMLnuevo() {
    this.limpiarObjetivos();
    this.limpiarDigital(14); //LIMPIA EL ARREGLO DE MICAELA
    this.limpiarDigital(19); //LIMPIA EL ARREGLO DE CYNTHIA
    let comprobantes = this.procesarXML();
    for (let i = 0; i < comprobantes.length; i++) {
      switch (comprobantes[i].vendedorCliente) {
        case 'FUGAS ALFREDO RAUL':
          this.sumatoriaObjetivos(comprobantes[i], 0);
          break;
        case 'NETTO FABIAN':
          this.sumatoriaObjetivos(comprobantes[i], 2);
          break;
        case 'JACOB GERMAN':
          this.sumatoriaObjetivos(comprobantes[i], 3);
          break;
        case 'CHIARDOLA IVAN':
          this.sumatoriaObjetivos(comprobantes[i], 5);
          break;
        case 'SPECTOR WALTER':
          this.sumatoriaObjetivos(comprobantes[i], 8);
          break;
        case 'ESTRADA MARCELO':
          this.sumatoriaObjetivos(comprobantes[i], 9);
          break;
        case 'EGEA WALTER':
          this.sumatoriaObjetivos(comprobantes[i], 11);
          break;
        case 'BEARZOTTI BRUNO':
          this.sumatoriaObjetivos(comprobantes[i], 12);
          break;
        case 'BREARD MICAELA':
          this.sumatoriaObjetivos(comprobantes[i], 14);
          break;
        case 'BANOVSKY NATALIA':
          this.sumatoriaObjetivos(comprobantes[i], 16);
          break;
        case 'PERALTA JAVIER':
          this.sumatoriaObjetivos(comprobantes[i], 17);
          break;
        case 'MAGNIN CYNTHIA':
          this.sumatoriaObjetivos(comprobantes[i], 19);
          break;
        case 'ATTIE OROME AGUSTIN':
          this.sumatoriaObjetivos(comprobantes[i], 21);
          break;
        case 'SILVESTRI MAXIMILIANO':
          this.sumatoriaObjetivos(comprobantes[i], 23);
          break;
        case 'GARCIA ARIEL':
          this.sumatoriaObjetivos(comprobantes[i], 24);
          break;
        case 'CORREA JOSE LAUTARO':
          this.sumatoriaObjetivos(comprobantes[i], 25);
          break;
      }
      switch (comprobantes[i].vendedorComprobante) {
        case 'BREARD MICAELA':
          this.sumatoriaDigital(comprobantes[i], 14);
          break;
        case 'MAGNIN CYNTHIA':
          this.sumatoriaDigital(comprobantes[i], 19);
          break;
      }
    }
    this.calcularComisionDigital();
    this.actualizarObjetivos();
  }

  calcularComisionDigital() {
    for (let i = 0; i < this.objetivos.length; i++) {
      let ventasTotalesDigitales = 0;
      if (this.objetivos[i].canal == 'digital') {
        ventasTotalesDigitales =
          this.objetivos[i].ventasVendedores[0].netto +
          this.objetivos[i].ventasVendedores[0].jacob +
          this.objetivos[i].ventasVendedores[0].bearzotti +
          this.objetivos[i].ventasVendedores[0].peralta +
          this.objetivos[i].ventasVendedores[0].attie +
          this.objetivos[i].ventasVendedores[0].silvestri;
        this.objetivos[i].ventasVendedores[0].garcia +
          this.objetivos[i].ventasVendedores[0].correa +
          this.objetivos[i].ventasVendedores[0].magnin +
          this.objetivos[i].ventasVendedores[0].bread
        this.objetivos[i].comision = ventasTotalesDigitales * 0.004;
      }
      if (this.objetivosEsp[0].coeficiente > 0.95) {
        this.objetivos[i].premioCoef = ventasTotalesDigitales * 0.001;
      } else {
        this.objetivos[i].premioCoef = ventasTotalesDigitales * 0.0005;
      }
    }
  }

  //ASIGNAR RANGO DE COLORES A OBJETIVO
  asignarRangoSemaforo(valor: number) {
    return this.calculos.asignarColorSemaforo(valor);
  }

  /* >> FUNCIONES PARA GRAFICAS */
  guardarSumatoriaDia() {
    //Función para guardar la sumatoria de los objetivos del día
    //primero limpiar los valores viejos por si se vuelve a cargar el mismo día
    this.sumatoriasMes[this.dd].ventastrad = 0;
    this.sumatoriasMes[this.dd].canttrad = 0;
    this.sumatoriasMes[this.dd].kgtrad = 0;
    this.sumatoriasMes[this.dd].arfvtrad = 0;
    this.sumatoriasMes[this.dd].arfctrad = 0;
    this.sumatoriasMes[this.dd].ventasdist = 0;
    this.sumatoriasMes[this.dd].cantdist = 0;
    this.sumatoriasMes[this.dd].kgdist = 0;
    this.sumatoriasMes[this.dd].arfvdist = 0;
    this.sumatoriasMes[this.dd].arfcdist = 0;

    for (let i = 0; i < this.objetivos.length; i++) {
      if (this.objetivos[i].canal == 'tradicional') {
        this.sumatoriasMes[this.dd].ventastrad += this.objetivos[i].ventas;
        this.sumatoriasMes[this.dd].canttrad += this.objetivos[i].cant;
        this.sumatoriasMes[this.dd].kgtrad += this.objetivos[i].kg;
        this.sumatoriasMes[this.dd].arfvtrad += this.objetivos[i].arfv;
        this.sumatoriasMes[this.dd].arfctrad += this.objetivos[i].arfc;
      }
      if (this.objetivos[i].canal == 'distribuidores') {
        this.sumatoriasMes[this.dd].ventasdist += this.objetivos[i].ventas;
        this.sumatoriasMes[this.dd].cantdist += this.objetivos[i].cant;
        this.sumatoriasMes[this.dd].kgdist += this.objetivos[i].kg;
        this.sumatoriasMes[this.dd].arfvdist += this.objetivos[i].arfv;
        this.sumatoriasMes[this.dd].arfcdist += this.objetivos[i].arfc;
      }
    }
    this.fb
      .actualizarSumatoriaDiario(
        this.sumatoriasMes[this.dd],
        this.mes,
        this.ano,
        this.dd
      )
      .subscribe((resp) => { });
  }

  //////////////////////////////////////////////////////////////////////////
  abrirModal() {
    this.cargarTrimestre();
    this.seleccionTrimestre();
  }

  seleccionVendedor() {
    let data = this.objetService.obtenerObjetivosCargadosVendedores(this.vendedorModal);
    this.cantModal = (Number.isNaN(Number(data.uniMes)) ? 0 : Number(data.uniMes));
    this.kgModal = (Number.isNaN(Number(data.kgMes)) ? 0 : Number(data.kgMes));
    this.ventasModal = (Number.isNaN(Number(data.ventaMes)) ? 0 : Number(data.ventaMes));
  }

  cargarTrimestre() {
    this.mesesTrimestre = [];
    switch (this.mesModal) {
      case '02':
        this.mesesTrimestre.push("Enero", "Febrero", "Marzo");
        break;
      case '05':
        this.mesesTrimestre.push("Abril", "Mayo", "Junio");
        break;
      case '08':
        this.mesesTrimestre.push("Julio", "Agosto", "Septiembre");
        break;
      default:
        this.mesesTrimestre.push("Octubre", "Noviembre", "Diciembre");
        break;
    }
    this.limpiarCamposModal();
    this.objetService.limpiarArrayObjetivos();
  }

  seleccionTrimestre() {
    this.objetService.cargarObjetivos(this.mesModal, this.ano).subscribe((resp) => {
      this.vendedoresSelect = this.objetService.obtenerVendedores();
      console.log('VENDEDORES', this.vendedoresSelect);
    });
  }

  cancelarCargaObjetivosTrimestrales() {
    this.objetService.limpiarArrayObjetivos();
    this.limpiarCamposModal();
  }

  guardarObjetivo() {
    this.objetService.actualizarArregloObjetivos(this.cantModal, this.kgModal, this.ventasModal, this.vendedorModal, this.mesModal, this.ano);
    this.limpiarCamposModal();
  }

  cambiarMetodoActivo(tabActivada: number) {
    this.tabActiva = tabActivada;
    this.limpiarCamposModal();
  }

  limpiarCamposModal() {
    this.vendedorModal = '';
    this.clienteModal = '';
    this.cantModal = 0;
    this.kgModal = 0;
    this.ventasModal = 0;
  }

}
