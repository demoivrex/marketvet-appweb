import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { PaljetService } from '../../services/paljet.service';
import { Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { BancoSinContrapartida } from 'src/app/models/bancoSinContrapartida.model';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-aprobacion-recibos',
  templateUrl: './aprobacion-recibos.component.html',
  styleUrls: ['./aprobacion-recibos.component.css'],
})
export class AprobacionRecibosComponent implements OnInit {
  recibos: any[] = [];
  listaRecibos: any[] = [];
  listaCondVenta: any[] = [];
  listaBancosSinContrapartida: BancoSinContrapartida[] = [];
  listaFiltradaBancosSinContrapartida: BancoSinContrapartida[] = [];
  listaSelecBancosSinContrapartida: BancoSinContrapartida[] = [];
  listaVendedores: any[] = [];
  condicionActual: any = null;
  reciboEditar;
  indice: number = null;
  modalcheque: boolean = false;
  modaldeposito: boolean = false;
  cerrarmodal: boolean = false;

  seccionURL: string = this.router.url.slice(1);
  verEditar: boolean = false;
  esquemaSelec: string = "1";
  filtroSelec: string = "";

  ano: string;
  mes: string;

  totalFacturaConDescNotaDebito: number = 0;
  totalReciboNotaCredito: number = 0;
  totalFormasPago: number = 0;

  //TOTALES TABLA
  totalEfectivo: number = 0;
  totalCheques: number = 0;
  totalDepositos: number = 0;
  totalRecibos: number = 0;

  //VARIABLES PAGINADO
  TAM_PAG: number = 14;
  cantPags: number = 0;
  selectedPage: number = 0;
  modoPaginado: number = 0;
  listaBSC: any[] = [];

  arregloDepositos = [
    {
      banco: 'BANCO HSBC AF',
      cta_bco: 4,
      cta_bco_id: 10,
    },
    {
      banco: 'SANTANDER RIO',
      cta_bco: 5,
      cta_bco_id: 11,
    },
    {
      banco: 'HSBC MARKETVET SA',
      cta_bco: 6,
      cta_bco_id: 59,
    },
    {
      banco: 'MERCADO PAGO',
      cta_bco: 7,
      cta_bco_id: 60,
    },
    {
      banco: 'EFECTIVO HSCB',
      cta_bco: 40,
      cta_bco_id: 57,
    },
    {
      banco: 'EFECTIVO SANTANDER RIO',
      cta_bco: 50,
      cta_bco_id: 58,
    },
  ];
  arregloPtosVta = [
    {
      vendedor: 'FN',
      pto_vta1: 1510,
      pto_vta1_id: 325,
      pto_vta2: 2511,
      tal_id_RCN: 326,
      cta_efect: 13,
      cta_efect_id: 15,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'JP',
      pto_vta1: 1520,
      pto_vta1_id: 336,
      pto_vta2: 2521,
      tal_id_RCN: 337,
      cta_efect: 38,
      cta_efect_id: 71,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'BB',
      pto_vta1: 1550,
      pto_vta1_id: 256,
      pto_vta2: 2551,
      tal_id_RCN: 341,
      cta_efect: 34,
      cta_efect_id: 63,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'GJ',
      pto_vta1: 1560,
      pto_vta1_id: 342,
      pto_vta2: 2561,
      tal_id_RCN: 450,
      cta_efect: 14,
      cta_efect_id: 16,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'AA',
      pto_vta1: 1600,
      pto_vta1_id: 486,
      pto_vta2: 2601,
      tal_id_RCN: 487,
      cta_efect: 40,
      cta_efect_id: 80,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'MS',
      pto_vta1: 1570,
      pto_vta1_id: 257,
      pto_vta2: 2571,
      tal_id_RCN: 324,
      cta_efect: 41,
      cta_efect_id: 83,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'AG',
      pto_vta1: 1590,
      pto_vta1_id: 457,
      pto_vta2: 2591,
      tal_id_RCN: 459,
      cta_efect: 42,
      cta_efect_id: 84,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'LC',
      pto_vta1: 1580,
      pto_vta1_id: 453,
      pto_vta2: 2581,
      tal_id_RCN: 455,
      cta_efect: 44,
      cta_efect_id: 85,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    },
    {
      vendedor: 'WE',
      pto_vta1: 1700,
      pto_vta1_id: 332,
      pto_vta2: 2701,
      tal_id_RCN: 259,
      cta_efect: 33,
      cta_efect_id: 30,
      tal_id: 506, //TAL ID NC 2111 RECIBO
    }
  ];
  arregloBancos = [
    { banco_id: 1, banco_nombre: 'BANCO CREDICOOP', id_cheque: 191 },
    {
      banco_id: 2,
      banco_nombre: 'BANCO DE LA NACION ARGENTINA',
      id_cheque: 11,
    },
    {
      banco_id: 5,
      banco_nombre: 'NUEVO BANCO DE SANTA FE S.A.',
      id_cheque: 330,
    },
    {
      banco_id: 10,
      banco_nombre: 'BANCO DE GALICIA Y BUENOS AIRES S.A.',
      id_cheque: 7,
    },
    {
      banco_id: 12,
      banco_nombre: 'BANCO DE LA PROVINCIA DE BUENOS AIRES',
      id_cheque: 14,
    },
    { banco_id: 13, banco_nombre: 'ICBC', id_cheque: 15 },
    { banco_id: 14, banco_nombre: 'CITIBANK N.A.', id_cheque: 16 },
    { banco_id: 15, banco_nombre: 'BBVA BANCO FRANCES S.A', id_cheque: 17 },
    {
      banco_id: 16,
      banco_nombre: 'THE BANCK OF TOKYO - MITSUBISHI UFJ, LTD.',
      id_cheque: 18,
    },
    {
      banco_id: 17,
      banco_nombre: 'BANCO DE LA PROVINCIA DE CORDOBA',
      id_cheque: 20,
    },
    { banco_id: 18, banco_nombre: 'BANCO SUPERVILLE S.A.', id_cheque: 27 },
    {
      banco_id: 19,
      banco_nombre: 'BANCO DE LA CIUDAD DE BUENOS AIRES',
      id_cheque: 29,
    },
    { banco_id: 20, banco_nombre: 'BANCO PATAGONIA S.A.', id_cheque: 34 },
    { banco_id: 21, banco_nombre: 'BANCO HIPOTECARIO S.A.', id_cheque: 44 },
    { banco_id: 22, banco_nombre: 'BANCO DE SAN JUAN S.A.', id_cheque: 45 },
    { banco_id: 23, banco_nombre: 'BANCO DO BRASIL S.A.', id_cheque: 46 },
    { banco_id: 25, banco_nombre: 'BANCO MUNICIPAL DE ROSARIO', id_cheque: 65 },
    { banco_id: 81, banco_nombre: 'BANCO DE CORRIENTES', id_cheque: 94 },
    { banco_id: 28, banco_nombre: 'BANCO DEL CHUBUT S.A.', id_cheque: 83 },
    { banco_id: 29, banco_nombre: 'BANCO DE SANTA CRUZ S.A.', id_cheque: 86 },
    {
      banco_id: 30,
      banco_nombre: 'BANCO DE LA PAMPA SOC. DE ECON. MIXTA',
      id_cheque: 93,
    },
    {
      banco_id: 32,
      banco_nombre: 'BANCO PROVINCIA DEL NEUQUEN S.A.',
      id_cheque: 97,
    },
    {
      banco_id: 34,
      banco_nombre: 'BANCO B.I. CREDITANSTALT S.A.',
      id_cheque: 147,
    },
    { banco_id: 36, banco_nombre: 'HSBC BANK ARGENTINA S.A.', id_cheque: 150 },
    {
      banco_id: 37,
      banco_nombre: 'JP MORGAN CHASE BANCK, SUCURSAL BS AS',
      id_cheque: 165,
    },
    { banco_id: 38, banco_nombre: 'BANCO DE VALORES S.A.', id_cheque: 198 },
    { banco_id: 40, banco_nombre: 'BANCO MARIVA S.A.', id_cheque: 254 },
    { banco_id: 41, banco_nombre: 'BANCO ITAU ARGENTINA S.A', id_cheque: 259 },
    { banco_id: 45, banco_nombre: 'BNP PARIBAS', id_cheque: 266 },
    {
      banco_id: 46,
      banco_nombre: 'BANCO DE LA PROVINCIA DE TIERRA DEL FUEGO',
      id_cheque: 268,
    },
    {
      banco_id: 47,
      banco_nombre: 'BANCO DE LA REPUBLICA ORIENTAL DEL URUGUAY',
      id_cheque: 269,
    },
    { banco_id: 49, banco_nombre: 'BANCO MERIDIAN S.A.', id_cheque: 281 },
    { banco_id: 50, banco_nombre: 'BANCO MACRO S.A.', id_cheque: 285 },
    { banco_id: 55, banco_nombre: 'BANCO COMAFI S.A', id_cheque: 299 },
    { banco_id: 57, banco_nombre: 'BANCO PIANO S.A', id_cheque: 301 },
    { banco_id: 58, banco_nombre: 'BANCO FINANSUR S.A', id_cheque: 303 },
    { banco_id: 59, banco_nombre: 'BANCO JULIO S.A', id_cheque: 305 },
    {
      banco_id: 61,
      banco_nombre: 'NUEVO BANCO DE LA RIOJA S.A',
      id_cheque: 309,
    },
    { banco_id: 63, banco_nombre: 'NUEVO BANCO DEL CHACO S.A', id_cheque: 311 },
    { banco_id: 67, banco_nombre: 'BANCO CMF S.A', id_cheque: 319 },
    { banco_id: 69, banco_nombre: 'BANCO INDUSTRIAL S.A', id_cheque: 322 },
    { banco_id: 70, banco_nombre: 'DEUTSCHE BANK S.A', id_cheque: 325 },
    {
      banco_id: 79,
      banco_nombre: 'NUEVO BANCO DE ENTRE RIOS S.A',
      id_cheque: 386,
    },
    { banco_id: 80, banco_nombre: 'BANCO SANTANDER RIO S.A.', id_cheque: 72 },
    { banco_id: 82, banco_nombre: 'BANCO BICA', id_cheque: 426 },
    { banco_id: 83, banco_nombre: 'BANCO SANTIAGO DEL ESTERO', id_cheque: 321 },
    { banco_id: 84, banco_nombre: 'BANCO COINAG', id_cheque: 431 },
    { banco_id: 85, banco_nombre: 'BANCO FORMOSA S.A', id_cheque: 315 },
    { banco_id: 86, banco_nombre: 'BANCO COLUMBIA', id_cheque: 389 },
    { banco_id: 87, banco_nombre: 'BANCO MASVENTAS', id_cheque: 341 },
    { banco_id: 88, banco_nombre: 'MERCADO PAGO', id_cheque: 100 },
    { banco_id: 89, banco_nombre: 'BANCO ROELA', id_cheque: 247 },
  ];

  constructor(private router: Router, private LOG: LogService, private fb: FirebaseService, private paljet: PaljetService) { }

  ngOnInit(): void {
    this.actualizar();
    this.cargarCondVentas();
    this.definirPaginado();
    this.obtenerFecha();
  }

  obtenerFecha() {
    const today = new Date();
    this.mes = ('0' + (today.getMonth() + 1)).slice(-2);
    this.ano = today.getFullYear().toString();
  }

  private listarTrans() {
    this.paljet.getBancoSinContrapartida(this.reciboEditar.vendedor, this.reciboEditar.colorRecibo)
      .subscribe((resp: BancoSinContrapartida[]) => {
        if (resp) {
          this.listaBancosSinContrapartida = resp;
          this.listaBancosSinContrapartida.forEach(banco => {
            banco.seleccionado = false;
          });
          this.listaFiltradaBancosSinContrapartida = this.listaBancosSinContrapartida;
          this.dividirListaBancosSC();
        }
      });
  }

  actualizar() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando recibos para aprobar...',
      icon: 'info',
    });
    Swal.showLoading();
    this.fb.cargarRecibos().subscribe((resp) => {
      this.recibos = resp.filter((item) => item.rendido);
      this.listaRecibos = resp.filter((item) => item.rendido);
      this.verEditar = false;
      this.filtrar(this.filtroSelec);
      Swal.close();
    });
  }

  cargarCondVentas() {
    this.fb.getDatosCondicionVenta().subscribe((resp: any[]) => {
      if (resp) this.listaCondVenta = resp;
    })
  }

  private calcularTotalesTabla() {
    this.blanquearTotalesTabla();
    this.totalEfectivo = this.recibos.reduce((acc, recibo) => acc + recibo.efectivo, 0);
    this.totalCheques = this.recibos.reduce((acc, recibo) => acc + recibo.cheque, 0);
    this.totalDepositos = this.recibos.reduce((acc, recibo) => acc + recibo.deposito, 0);
    this.totalRecibos = this.recibos.reduce((acc, recibo) => acc + recibo.total, 0);
  }

  private blanquearTotalesTabla() {
    this.totalEfectivo = 0;
    this.totalCheques = 0;
    this.totalDepositos = 0;
    this.totalRecibos = 0;
  }

  cargarVendedores() {
    this.fb.getVendedores().subscribe((resp: any[]) => {
      if (resp) {
        this.listaVendedores = resp;
        this.listaVendedores = this.listaVendedores.filter((vend) => vend.iniciales === this.reciboEditar.vendedor);
      }
    })
  }

  noFiltrar() {
    this.filtroSelec = "";
    this.esquemaSelec = "1"
    this.actualizar();
  }

  filtrar(key: string) {
    this.filtroSelec = key;
    this.recibos = this.listaRecibos.filter((item) => {
      return item.rendido && (key !== "" ? item.vendedor.trim() === key : true) && (this.esquemaSelec !== "1" ? item.colorRecibo.toString() === this.esquemaSelec : true);
    });
    this.calcularTotalesTabla();
  }

  eliminarRecibo(recibo, i) {
    Swal.fire({
      title: 'Desea eliminar el Recibo?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fb
          .archivarRecibo(recibo)
          .subscribe((resp) => this.actualizar());
        Swal.fire('Eliminado!', '', 'success');
      }
    });
  }

  eliminarRecibos() {
    var texto = "";
    if (!this.filtroSelec) {
      texto = "TODOS";
    } else {
      texto = this.filtroSelec;
    }
    Swal.fire({
      title: 'Desea eliminar TODOS los recibos con el filtro ' + texto + '?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let resguardo = [];
        for (let i = 0; i < this.recibos.length; i++) {
          resguardo.push(JSON.parse(JSON.stringify(this.recibos[i])));
        }
        for (let i = 0; i < this.recibos.length; i++) {
          this.fb.archivarRecibo(this.recibos[i]).subscribe();
        }
        Swal.fire('Eliminado!', '', 'success');
        this.actualizar(); //VOLVER A CARGAR LOS RECIBOS
      }
    });
  }

  eliminarRecibosAprobados() {
    var texto = "";
    if (!this.filtroSelec) {
      texto = "TODOS";
    } else {
      texto = this.filtroSelec;
    }
    Swal.fire({
      title: 'Desea eliminar TODOS los recibos con el filtro ' + texto + '?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        let resguardo = [];
        for (let i = 0; i < this.recibos.length; i++) {
          if (this.recibos[i].aprobado) {
            resguardo.push(JSON.parse(JSON.stringify(this.recibos[i])));
          }
        }
        for (let i = 0; i < this.recibos.length; i++) {
          if (this.recibos[i].aprobado) {
            this.fb.archivarRecibo(this.recibos[i]).subscribe();
          }
        }
        Swal.fire('Eliminado!', '', 'success');
        this.actualizar(); //VOLVER A CARGAR LOS RECIBOS
      }
    });
  }

  reciboEditarNC: number;
  reciboEditarRC: number;
  reciboEditarND: number;
  verRecibo(idRecibo) {
    this.fb.cargarRecibo(idRecibo).subscribe((resp) => {
      this.reciboEditar = resp;
      this.listarTrans();
      this.cargarVendedores();
      this.verEditar = true;
      this.procesarReciboVer(this.reciboEditar);
      this.calcularTotales();
      if (this.listaCondVenta) {
        this.condicionActual = (this.reciboEditar.condicionVentaId === 0 ?
          this.listaCondVenta.filter((cond) => cond.idCondVenta = 2)[0] :
          this.listaCondVenta.filter((cond) => cond.idCondVenta =
            this.reciboEditar.condicionVentaId)[0]);
      };
    });
  }

  procesarReciboVer(recibo) {
    this.reciboEditarNC = 0;
    this.reciboEditarND = 0;
    this.reciboEditarRC = 0;

    for (let i = 0; i < recibo.facturas.length; i++) {
      if (recibo.facturas[i].cpr_tipo_id == 'RC') {
        this.reciboEditarRC += recibo.facturas[i].saldo;
      }
      if (recibo.facturas[i].cpr_tipo_id == 'ND') {
        this.reciboEditarND += recibo.facturas[i].saldo;
      }
      if (recibo.facturas[i].cpr_tipo_id == 'NC') {
        this.reciboEditarNC += recibo.facturas[i].saldo;
      }
    }
  }

  volver() {
    this.actualizar();
    this.verEditar = false;
    this.reciboEditar = false
  }

  generaCprCancela(cpr, color, sit_ante_iva, pto_vta, tal_id, talnc_id) {
    let descuento: number = cpr.descuento
      ? Number(cpr.descuento.toFixed(2))
      : 0;
    let porcentajeDescuento = cpr.porcentajeDescuento
      ? Number(cpr.porcentajeDescuento)
      : 0;
    const monto: number = Number((cpr.saldo - descuento).toFixed(2));
    let credito_fiscal = false;
    let cprtipo = 'NC';
    let cptodtoid = 1714;
    if (!color) {
      // BLANCO
      pto_vta = 11;
      cptodtoid = 18;
      if (sit_ante_iva == 'MO' || sit_ante_iva == 'RI') {
        //SI ES FACTURA EN BLANCO Y RI O MONOTRIBUTISTA
        talnc_id = 478; // ID TALONARIO NC A
        credito_fiscal = true;
      } else {
        talnc_id = 479; // ID TALONARIO NC B
      }
    } else {
      // NEGRO
      talnc_id = tal_id;
      pto_vta = 2111; // Editar esta funcion para que no se pida mas por parametro pto_vta, que es siempre fijo para blanco o negro
    }
    const facturaDTO = {
      cpr_tipo_id: cprtipo,
      cpto_dto_id: cptodtoid,
      cpr_cancela_id: cpr.cprId,
      pto_vta: pto_vta,
      tal_id: talnc_id,
      monto_dto: descuento,
      porc_dto: porcentajeDescuento,
      monto_aplica: monto,
      computa_cf: credito_fiscal,
    };
    return facturaDTO;
  }

  generaCprInputa(cpr) {
    const inputaDTO = {
      cpr_imputa_id: cpr.cprId,
      monto_aplica: cpr.saldo,
    };
    return inputaDTO;
  }

  generaCprInputaBSC(cpr) {
    const inputaDTO = {
      cpr_imputa_id: cpr.cpr_id,
      monto_aplica: cpr.monto,
    };
    return inputaDTO;
  }

  asignarPtoVta(recibo): any {
    for (let i = 0; i < this.arregloPtosVta.length; i++) {
      if (recibo.vendedor == this.arregloPtosVta[i].vendedor) {
        return this.arregloPtosVta[i];
      }
    }
  }

  procesarCodigoCheque(codigo, i) {
    this.reciboEditar.cheques[i].id_cheque = Number(codigo.substr(1, 3));
    this.reciboEditar.cheques[i].nrosucursal = codigo.substr(4, 3);
    this.reciboEditar.cheques[i].codigopostal = codigo.substr(7, 4);
    this.reciboEditar.cheques[i].digitosCheque = codigo.substr(11, 8);
    this.reciboEditar.cheques[i].nrocuenta = codigo.substr(19, 11);

    // Buscar el banco correspondiente en el arregloBancos
    const bancoAsociado = this.arregloBancos.find(
      (banco) => banco.id_cheque === this.reciboEditar.cheques[i].id_cheque
    );

    // Si se encuentra el banco, asociar el banco_id y el nombre del banco
    if (bancoAsociado) {
      this.reciboEditar.cheques[i].banco_id = bancoAsociado.banco_id;
      this.reciboEditar.cheques[i].banco = bancoAsociado.banco_nombre;
    }
  }

  asociarBancoId(idCheque: number, indice: number) {
    // Busca el objeto correspondiente en arregloBancos
    const bancoEncontrado = this.arregloBancos.find(
      (banco) => banco.id_cheque === idCheque
    );

    if (bancoEncontrado) {
      // Asigna el banco_id al objeto del cheque
      this.reciboEditar.cheques[indice].banco_id = bancoEncontrado.banco_id;
    } else {
      // Maneja el caso en el que no se encuentra el banco correspondiente
      console.error('No se encontró un banco para el id_cheque:', idCheque);
      // Puedes tomar medidas adicionales, como asignar un valor predeterminado o mostrar un mensaje de error
    }
  }

  generarValores(recibo, cta_efect_id) {
    const valoresArray: any[] = [];

    //EFECTIVO
    if (recibo.efectivo > 0) {
      const efectivoDTO = {
        val_tipo_id: 1,
        cta_id: cta_efect_id,
        monto: recibo.efectivo,
        moneda_id: 1,
      };
      valoresArray.push(efectivoDTO);
    }

    //CHEQUE
    if (recibo.cheque > 0) {
      for (let i = 0; i < recibo.cheques.length; i++) {
        const fechaEmision = new Date(recibo.cheques[i].fecha + 'T10:00:00.000Z');
        const fechaCobro = new Date(recibo.cheques[i].fechacobro + 'T10:00:00.000Z');

        const chequeDTO = {
          val_tipo_id: 4, //ID DE LOS CHEQUES
          cta_id: cta_efect_id,
          banco_id: recibo.cheques[i].banco_id,
          nro_suc: recibo.cheques[i].nrosucursal,
          cod_postal: recibo.cheques[i].codigopostal,
          nro_cta: recibo.cheques[i].nrocuenta,
          nro_cheque: recibo.cheques[i].digitosCheque,
          fecha: fechaEmision.toISOString(),
          fecha_cobro: fechaCobro.toISOString(),
          monto: recibo.cheques[i].importeCheque,
          ch_terceros: recibo.cheques[i].terceros,
          otras_plazas: false,
          cruzado: recibo.cheques[i].cruzado,
          a_la_orden: recibo.cheques[i].alaorden,
          moneda_id: 1,
          electronico: false,
        };
        valoresArray.push(chequeDTO);
      }
    }
    return valoresArray;
  }

  reciboJson;

  guardarRecibo(recibo) {
    recibo.guardado = true;
    this.completarDepositos();
    this.fb.actualizarRecibo(recibo).subscribe();
  }

  aprobarRecibo(recibo) {
    const cancelaArray: any[] = [];
    const inputaArray: any[] = [];
    const ptoVta = this.asignarPtoVta(recibo);

    let pto_vta;
    let tal_id = 0;
    let tal_id_RC = 0;
    let cond_vta;
    let fecha_emision = new Date();
    const cta_efect_id = ptoVta.cta_efect_id;

    this.completarDepositos();

    if (recibo.colorRecibo) {
      //RECIBO EN NEGRO
      pto_vta = ptoVta.pto_vta2;
      tal_id_RC = ptoVta.tal_id_RCN;
      tal_id = ptoVta.tal_id;
      fecha_emision = recibo.fecha;
    } else {
      //RECIBO EN BLANCO
      pto_vta = ptoVta.pto_vta1;
      tal_id_RC = ptoVta.pto_vta1_id;
    }

    if (recibo.condicionVentaId == 0) cond_vta = 2;
    else cond_vta = this.condicionActual.idCondVenta;

    recibo.guardado = true;

    for (let i = 0; i < recibo.facturas.length; i++) {
      if (recibo.facturas[i].cpr_tipo_id == 'FA' || recibo.facturas[i].cpr_tipo_id == 'ND') {
        cancelaArray.push(
          this.generaCprCancela(
            recibo.facturas[i],
            recibo.colorRecibo,
            recibo.cliente.sit_ante_iva,
            pto_vta,
            tal_id,
            ptoVta.tal_id
          )
        );
      }
      if (
        recibo.facturas[i].cpr_tipo_id == 'RC' ||
        recibo.facturas[i].cpr_tipo_id == 'NC'
      ) inputaArray.push(this.generaCprInputa(recibo.facturas[i]));
    }

    //CARGAR TRANSFERENCIAS A IMPUTAARRAY
    for (let i = 0; i < this.listaBancosSinContrapartida.length; i++) {
      if (this.listaBancosSinContrapartida[i].seleccionado) {
        inputaArray.push(this.generaCprInputaBSC(this.listaBancosSinContrapartida[i]));
      }
    }
    const valoresArray = this.generarValores(recibo, cta_efect_id);

    let reciboFinal = {
      cli_id: recibo.idCliente,
      cpr_clasif_id: 0,
      cond_vta_id: cond_vta,
      cuit: recibo.cliente.cuit,
      domicilio: recibo.cliente.domicilios[0].domicilio,
      fecha_emision: fecha_emision,
      fecha_imput: new Date(),
      localidad_id: recibo.cliente.domicilios[0].localidad.loc_id,
      localidad: recibo.cliente.domicilios[0].localidad.nombre,
      nota: recibo.comentario,
      observacion: '',
      pto_vta: pto_vta,
      razon_social: recibo.cliente.razonSocial,
      tal_id: tal_id_RC,
      telefono: recibo.cliente.telefonos[0].numero,
      cancela: cancelaArray,
      imputa: inputaArray,
      valores: valoresArray,
    };

    this.reciboJson = reciboFinal;

    this.paljet
      .enviarRecibo(reciboFinal, recibo.vendedor, recibo.colorRecibo)
      .subscribe((resp) => {
        recibo.aprobado = true;
        this.fb.actualizarRecibo(recibo).subscribe((resp) => {
          this.verEditar = false;
          this.reciboEditar = false
          this.actualizar();
        });

        this.fb.cargarRegistroRecibo(this.mes, this.ano, reciboFinal).subscribe();
      });
  }

  cargarCheque(i: number) {
    this.modalcheque = true;
    this.cerrarmodal = false;
    this.indice = i;
    if (!this.reciboEditar.cheques[this.indice].moneda) {
      this.reciboEditar.cheques[this.indice].codcheque = null;
      this.reciboEditar.cheques[this.indice].banco_id = null;
      this.reciboEditar.cheques[this.indice].banco = null;
      this.reciboEditar.cheques[this.indice].nrosucursal = null;
      this.reciboEditar.cheques[this.indice].codigopostal = null;
      this.reciboEditar.cheques[this.indice].nrocuenta = null;
      this.reciboEditar.cheques[this.indice].cuenta = null;
      this.reciboEditar.cheques[this.indice].moneda = 'PESO';
      this.reciboEditar.cheques[this.indice].fecha = null;
      this.reciboEditar.cheques[this.indice].fechacobro = null;
      this.reciboEditar.cheques[this.indice].cuit = null;
      this.reciboEditar.cheques[this.indice].alaorden = false;
      this.reciboEditar.cheques[this.indice].cruzado = false;
      this.reciboEditar.cheques[this.indice].terceros = false;
      this.reciboEditar.cheques[this.indice].electronico = false;
      this.reciboEditar.cheques[this.indice].nota = null;
    }
  }

  actualizarCheque() {
    this.fb.actualizarRecibo(this.reciboEditar).subscribe((resp) => {
      this.cerrarmodal = true;
    });
  }

  cargarDeposito(i: number) {
    this.modaldeposito = true;
    this.cerrarmodal = false;
    this.indice = i;
    if (!this.reciboEditar.depositos[this.indice].cruzado) {
      this.reciboEditar.depositos[this.indice].banco;
      this.reciboEditar.depositos[this.indice].monedadep = 'PESO';
      this.reciboEditar.depositos[this.indice].cotizacion = 1.0;
      this.reciboEditar.depositos[this.indice].fecha = null;
      this.reciboEditar.depositos[this.indice].nrcpr = null;
      this.reciboEditar.depositos[this.indice].importeBanco;
      this.reciboEditar.depositos[this.indice].nota = null;
    }
  }

  actualizarDeposito() {
    this.fb.actualizarRecibo(this.reciboEditar).subscribe((resp) => {
      this.cerrarmodal = true;
    });
  }

  desaprobarRecibo(recibo) {
    recibo.rendido = false;
    this.fb.actualizarRecibo(recibo).subscribe();
    this.actualizar();
  }

  filtrarBancoSinContrapartida(event: any) {
    this.listaFiltradaBancosSinContrapartida = this.listaBancosSinContrapartida.filter(
      (transf) => transf.cpr_id.toString().includes(event.target.value)
        || transf.monto.toString().includes(event.target.value) || transf.razon_social.includes(event.target.value.toUpperCase()));
    this.dividirListaBancosSC();
  }

  dividirListaBancosSC() {
    this.listaBSC = [];
    for (var i = 0; i < this.listaFiltradaBancosSinContrapartida.length; i += this.TAM_PAG) {
      this.listaBSC.push(this.listaFiltradaBancosSinContrapartida.slice(i, i + this.TAM_PAG));
    }
    this.cantPags = this.listaBSC.length;
    this.definirPaginado();
  }

  cambiarPagina(index) {
    if (index >= 0 && index < this.cantPags) {
      this.selectedPage = index;
      this.definirPaginado();
    }
  }

  definirPaginado() {
    if (this.cantPags > 8) {
      if (this.selectedPage > 3) {
        if ((this.cantPags - 1 - this.selectedPage < 4) || (this.selectedPage < 4)) this.modoPaginado = 2;
        else this.modoPaginado = 1;
      } else this.modoPaginado = 0;
    } else this.modoPaginado = 3;
  }

  completarDepositos() {
    this.listaSelecBancosSinContrapartida = [];
    for (let i = 0; i < this.listaBancosSinContrapartida.length; i++) {
      if (this.listaBancosSinContrapartida[i].seleccionado) {
        this.listaSelecBancosSinContrapartida.push(this.listaBancosSinContrapartida[i]);
      }
    }

    if (this.reciboEditar.depositos) {
      for (let i = 0; i < this.listaSelecBancosSinContrapartida.length; i++) {
        this.reciboEditar.depositos[i].fecha = this.listaSelecBancosSinContrapartida[i].fec_emision;
        this.reciboEditar.depositos[i].nrocpr = this.listaSelecBancosSinContrapartida[i].cpr_id;
        this.reciboEditar.depositos[i].importeBanco = this.listaSelecBancosSinContrapartida[i].monto;
      }
    }
    this.calcularTotales();
  }

  calcularTotales() {
    let totalFacturaConDescNotaDebito = 0;
    let totalReciboNotaCredito = 0;
    let totalFormasPago = 0;

    for (let i = 0; i < this.reciboEditar.facturas.length; i++) {
      switch (this.reciboEditar.facturas[i].cpr_tipo_id) {
        case 'FA':
        case 'ND':
          totalFacturaConDescNotaDebito += (this.reciboEditar.facturas[i].saldo - (this.reciboEditar.facturas[i].descuento === undefined ? 0 : this.reciboEditar.facturas[i].descuento));
          break;
        case 'NC':
        case 'RC':
          totalReciboNotaCredito += this.reciboEditar.facturas[i].saldo;
          break;
      }
    }

    totalFormasPago = this.reciboEditar.efectivo + this.reciboEditar.cheque + this.reciboEditar.deposito;
    this.totalFacturaConDescNotaDebito = totalFacturaConDescNotaDebito;
    this.totalReciboNotaCredito = totalReciboNotaCredito;
    this.totalFormasPago = totalFormasPago;
  }

  async generarExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Estilos
    const headerStyle: any = { font: { bold: true } };
    const currencyFormat = '"$"#,##0.00';
    const blackFill: any = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF000000' } };
    const whiteFont: any = { bold: true, color: { argb: 'FFFFFFFF' } };
    const greyFill: any = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9D9D9' } };
    const blackBoldFont: any = { bold: true, color: { argb: 'FF000000' } };

    const setBlackHeader = (cellId: string) => {
      worksheet.getCell(cellId).fill = blackFill;
      worksheet.getCell(cellId).font = whiteFont;
    };

    const setGreyCell = (cellId: string, isBold = false) => {
      worksheet.getCell(cellId).fill = greyFill;
      if (isBold) {
        worksheet.getCell(cellId).font = blackBoldFont;
      }
    };

    // 1. VENDEDOR (Celda A2)
    let nombreVendedor = '';
    if (this.recibos.length > 0) {
      const vendedorIniciales = this.recibos[0].vendedor;
      const vendedorObj = this.listaVendedores.find(v => v.iniciales === vendedorIniciales);
      nombreVendedor = vendedorObj ? vendedorObj.nombre : vendedorIniciales;
    }
    worksheet.getCell('A2').value = nombreVendedor;
    worksheet.getCell('A1').value = 'VENDEDOR';
    setBlackHeader('A1');

    // 2. FECHA (Celda B2)
    const today = new Date();
    worksheet.getCell('B2').value = today;
    worksheet.getCell('B1').value = 'FECHA';
    setBlackHeader('B1');

    // 3. FECHA CIERRE CAJA (Celda C3) -> C2 (Assuming row 2 based on B2) but user said C3? 
    // "FECHA CIERRE CAJA (Celda C3)" -> Usually headers are aligned. Let's put label in C1, Value in C2? 
    // Screenshot shows headers in Row 1 (VENDEDOR, FECHA, FECHA CIERRE CAJA).
    // So Values are in Row 2.
    // User said "FECHA CIERRE CAJA (Celda C3)". Maybe header is C3? 
    // Looking at screenshot:
    // A1: VENDEDOR, B1: FECHA, C1: FECHA CIERRE CAJA
    // A2: GERMAN, B2: 02-ene, C2: 05-ene
    // So I will follow screenshot for alignment if user text is slightly off or I misunderstood "Celda C3".
    // Actually user text: "FECHA CIERRE CAJA (Celda C3) debe quedar en blanco". 
    // In screenshot C1 is header, C2 is value. Maybe they meant C2? Or maybe they want it in C3 specifically?
    // I will put Header in C1 and Value in C2 (Empty) to match structure of A/B.
    worksheet.getCell('C1').value = 'FECHA CIERRE CAJA';
    setBlackHeader('C1');
    worksheet.getCell('C2').value = '';

    // Calculos de Cobranza
    let cobranzaB = 0;
    let cobranzaN = 0;

    this.recibos.forEach(recibo => {
      if (!recibo.colorRecibo) { // Esquema I (Blanco)
        cobranzaB += recibo.total;
      } else { // Esquema II (Negro)
        cobranzaN += recibo.total;
      }
    });

    const totalCobranza = cobranzaB + cobranzaN;

    // 4. COBRANZA B (Celda B4) - Label A4
    worksheet.getCell('A4').value = 'COBRANZA B';
    setBlackHeader('A4');
    worksheet.getCell('B4').value = cobranzaB;
    worksheet.getCell('B4').numFmt = currencyFormat;

    // 5. COBRANZA N (Celda B5) - Label A5
    worksheet.getCell('A5').value = 'COBRANZA N';
    setBlackHeader('A5');
    worksheet.getCell('B5').value = cobranzaN;
    worksheet.getCell('B5').numFmt = currencyFormat;

    // 6. TOTAL COBRANZA (Celda B6) - Label A6
    worksheet.getCell('A6').value = 'TOTAL COBRANZA';
    setBlackHeader('A6');
    worksheet.getCell('B6').value = { formula: 'B4+B5', result: totalCobranza };
    worksheet.getCell('B6').numFmt = currencyFormat;
    setBlackHeader('B6');

    // TOTAL CHEQUES (Celda F1) -> Label E1, Value F1
    worksheet.getCell('E1').value = 'TOTAL CHEQUES MKVT';
    setBlackHeader('E1');
    worksheet.getCell('F1').value = this.totalCheques;
    worksheet.getCell('F1').numFmt = currencyFormat;

    // TOTAL DEPOSITOS MKVT (Celda F2) -> Label E2, Value F2
    worksheet.getCell('E2').value = 'TOTAL DEPOSITOS MKVT';
    setBlackHeader('E2');
    worksheet.getCell('F2').value = this.totalDepositos;
    worksheet.getCell('F2').numFmt = currencyFormat;

    // TOTAL GASTOS (Celda F3) -> Label E3
    worksheet.getCell('E3').value = 'TOTAL GASTOS';
    setBlackHeader('E3');
    worksheet.getCell('F3').value = { formula: 'B15' };
    worksheet.getCell('F3').numFmt = currencyFormat;

    // SUBTOTAL (Celda F4) -> Label E4
    worksheet.getCell('E4').value = 'SUBTOTAL';
    setBlackHeader('E4');
    worksheet.getCell('F4').value = { formula: 'SUM(F1:F3)' };
    worksheet.getCell('F4').numFmt = currencyFormat;

    // Columna H - Resumen
    // TOTAL COBRANZA (Celda H1) -> Label G1
    worksheet.getCell('G1').value = 'TOTAL COBRANZA';
    setBlackHeader('G1');
    worksheet.getCell('H1').value = totalCobranza;
    worksheet.getCell('H1').numFmt = currencyFormat;
    setBlackHeader('H1');

    // SUBTOTAL (Celda H2) -> Label G2
    worksheet.getCell('G2').value = 'SUBTOTAL';
    worksheet.getCell('G2').font = headerStyle;
    worksheet.getCell('H2').value = { formula: 'SUM(F1:F3)' };
    worksheet.getCell('H2').numFmt = currencyFormat;

    // RETIRO DE SUELDO (Celda H3) -> Label G3
    worksheet.getCell('G3').value = 'RETIRO DE SUELDO';
    worksheet.getCell('G3').font = headerStyle;

    // EFECTIVO A RENDIR (Celda H4) -> Label G4
    worksheet.getCell('G4').value = 'EFECTIVO A RENDIR';
    worksheet.getCell('G4').font = headerStyle;
    worksheet.getCell('H4').value = { formula: 'H1-(H2+H3)' };
    worksheet.getCell('H4').numFmt = currencyFormat;

    // TOTAL EFECTIVO A RENDIR (Celda H5) -> Label G5 "TOTAL EFECTIVO ENTREGADO" per screenshot/logic
    worksheet.getCell('G5').value = 'TOTAL EFECTIVO ENTREGADO';
    worksheet.getCell('G5').font = headerStyle;

    // SOBRANTE/FALTANTE EXCEL (Celda H7) -> Label G7
    worksheet.getCell('G7').value = 'SOBRANTE/FALTANTE EXCEL';
    worksheet.getCell('G7').font = headerStyle;
    worksheet.getCell('H7').value = { formula: 'H5-H4' };
    worksheet.getCell('H7').numFmt = currencyFormat;

    // --- TABLA INFERIOR ---
    const startRow = 9;

    worksheet.getCell(`A${startRow}`).value = 'VIATICOS';
    setBlackHeader(`A${startRow}`);
    setBlackHeader(`B${startRow}`);

    worksheet.getCell(`C${startRow}`).value = 'CHEQUES';
    setBlackHeader(`C${startRow}`);
    setBlackHeader(`D${startRow}`);

    worksheet.getCell(`E${startRow}`).value = 'DEPÓSITOS';
    setBlackHeader(`E${startRow}`);
    setBlackHeader(`F${startRow}`);

    // Viaticos
    const viaticos = ['COMBUSTIBLE', 'COMIDA', 'ESTACIONAMIENTO', 'PEAJE', 'HOSPEDAJE', 'TOTAL GASTOS'];
    let currentRow = startRow + 1;
    viaticos.forEach(item => {
      worksheet.getCell(`A${currentRow}`).value = item;
      if (item === 'TOTAL GASTOS') {
        worksheet.getCell(`A${currentRow}`).font = headerStyle;
        const firstRow = startRow + 1;
        const lastRow = currentRow - 1;
        worksheet.getCell(`B${currentRow}`).value = { formula: `SUM(B${firstRow}:B${lastRow})` };
        worksheet.getCell(`B${currentRow}`).numFmt = currencyFormat;
      }
      currentRow++;
    });

    // Cheques
    let chequesRow = startRow + 1;
    let totalChequesCheck = 0;
    this.recibos.forEach(recibo => {
      if (recibo.cheque > 0) {
        worksheet.getCell(`C${chequesRow}`).value = recibo.cliente.razonSocial;
        worksheet.getCell(`D${chequesRow}`).value = recibo.cheque;
        worksheet.getCell(`D${chequesRow}`).numFmt = currencyFormat;
        totalChequesCheck += recibo.cheque;
        chequesRow++;
      }
    });
    // Total Cheque at bottom
    worksheet.getCell(`C${chequesRow}`).value = 'TOTAL CHEQUE';
    worksheet.getCell(`C${chequesRow}`).font = headerStyle;
    worksheet.getCell(`D${chequesRow}`).value = totalChequesCheck;
    worksheet.getCell(`D${chequesRow}`).numFmt = currencyFormat;

    // Depositos
    let depositosRow = startRow + 1;
    let totalDepositosCheck = 0;
    this.recibos.forEach(recibo => {
      if (recibo.deposito > 0) {
        worksheet.getCell(`E${depositosRow}`).value = recibo.cliente.razonSocial;
        worksheet.getCell(`F${depositosRow}`).value = recibo.deposito;
        worksheet.getCell(`F${depositosRow}`).numFmt = currencyFormat;
        totalDepositosCheck += recibo.deposito;
        depositosRow++;
      }
    });
    // Total Depositos at bottom
    worksheet.getCell(`E${depositosRow}`).value = 'TOTAL DEPOSITOS MKVT';
    worksheet.getCell(`E${depositosRow}`).font = headerStyle;
    worksheet.getCell(`F${depositosRow}`).value = totalDepositosCheck;
    worksheet.getCell(`F${depositosRow}`).numFmt = currencyFormat;


    // Resumen pequeno
    let resumenRow = startRow + 2;
    worksheet.getCell(`G${resumenRow}`).value = 'FECHA';
    setGreyCell(`G${resumenRow}`, true);
    worksheet.getCell(`G${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell(`H${resumenRow}`).value = today;
    setGreyCell(`H${resumenRow}`);
    worksheet.getCell(`H${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    resumenRow++;

    worksheet.getCell(`G${resumenRow}`).value = 'TOTAL GASTOS';
    setGreyCell(`G${resumenRow}`, true);
    worksheet.getCell(`G${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell(`H${resumenRow}`).value = { formula: `B${currentRow - 1}` };
    worksheet.getCell(`H${resumenRow}`).numFmt = currencyFormat;
    setGreyCell(`H${resumenRow}`);
    worksheet.getCell(`H${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    resumenRow++;

    worksheet.getCell(`G${resumenRow}`).value = 'SOBRANTE/FALTANTE SISTEMA';
    setGreyCell(`G${resumenRow}`, true);
    worksheet.getCell(`G${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.getCell(`H${resumenRow}`).value = { formula: 'H7' };
    worksheet.getCell(`H${resumenRow}`).numFmt = currencyFormat;
    setGreyCell(`H${resumenRow}`);
    worksheet.getCell(`H${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    resumenRow++;

    worksheet.getCell(`G${resumenRow}`).value = 'FECHA CIERRE CAJA';
    setGreyCell(`G${resumenRow}`, true);
    worksheet.getCell(`G${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    setGreyCell(`H${resumenRow}`);
    worksheet.getCell(`H${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    resumenRow++;

    worksheet.getCell(`G${resumenRow}`).value = 'OBSERVACION:';
    setGreyCell(`G${resumenRow}`, true);
    worksheet.getCell(`G${resumenRow}`).border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    worksheet.mergeCells(`G${resumenRow}:H${resumenRow + 2}`);
    worksheet.getCell(`G${resumenRow}`).alignment = { vertical: 'top', wrapText: true };
    worksheet.getCell(`G${resumenRow}`).fill = greyFill as any; // Reapply fill after merge.
    worksheet.getCell(`H${resumenRow + 2}`).border = { right: { style: 'thin' }, bottom: { style: 'thin' } }; // Fix border

    // Auto-width
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
    worksheet.getColumn('A').width = 25;
    worksheet.getColumn('C').width = 30;
    worksheet.getColumn('E').width = 30;

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, `Reporte_Caja_${this.ano}-${this.mes}.xlsx`);

  }
}