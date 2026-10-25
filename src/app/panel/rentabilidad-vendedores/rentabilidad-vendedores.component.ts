import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Role } from '../../models/roles.enum';

interface RentabilidadRow {
  id: string;
  proveedor: string;
  medida: string;
  modelo: string;
  lista?: string;
  costo: number;
  costoOriginal: number;
  dtoFinanciero: number;
  dtoTransfer: number;
  dtoTrimestral: number;
  dtoDistribuidor: number;
  total: number;
  rentabilidad: number;
  rentabilidadPorcentaje: number;
}

interface TotalesRentabilidad {
  costo: number;
  total: number;
  rentabilidad: number;
  rentabilidadPorcentaje: number;
}

interface TotalesCanal {
  costo: number;
  total: number;
  rentabilidad: number;
  rentabilidadPorcentaje: number;
}

interface CanalData {
  nombre: string;
  vendedores: RentabilidadVendedor[];
  totales: TotalesCanal;
}

interface RentabilidadVendedor {
  vendedor: string;
  rows: RentabilidadRow[];
  totales: TotalesRentabilidad;
  totalesDistribuidor?: TotalesRentabilidad;
  totalesTradicional?: TotalesRentabilidad;
}

@Component({
  selector: 'app-rentabilidad-vendedores',
  templateUrl: './rentabilidad-vendedores.component.html',
  styleUrls: ['./rentabilidad-vendedores.component.css']
})
export class RentabilidadVendedoresComponent implements OnInit {

  xmlobj: string = '';
  mes: number = 1;
  ano: number = new Date().getFullYear();
  descuentosHabilitados: boolean = false;
  vendedorSeleccionado: string = 'MarketVet';

  tablaEmpresa: RentabilidadRow[] = [];
  totalesEmpresa: TotalesRentabilidad = { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 };
  tablasVendedores: RentabilidadVendedor[] = [];
  canales: CanalData[] = [];

  canalDigital = ['MAGNIN CYNTHIA', 'BREARD MICAELA'];
  canalDistribuidor = ['EGEA WALTER', 'SPECTOR WALTER', 'FUGAS ALFREDO RAUL'];
  isDigital: boolean = false;

  constructor(private firebaseService: FirebaseService, private authService: AuthService) { }

  ngOnInit(): void {
    const today = new Date();
    this.mes = (today.getMonth() + 1);
    this.isDigital = this.authService.getUserRole() === Role.DIGITAL;
    if (this.isDigital) {
      this.vendedorSeleccionado = this.canalDigital[0];
    }
  }

  get vendedoresDisponibles() {
    if (this.isDigital) {
      return this.tablasVendedores.filter(v => this.canalDigital.includes(v.vendedor));
    }
    return this.tablasVendedores;
  }

  procesarXML() {
    if (!this.xmlobj || this.xmlobj.trim() === '') {
      Swal.fire({
        title: 'Error!',
        text: 'Debe ingresar un XML válido',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: 'Espere!',
      text: 'Procesando XML',
      icon: 'info',
    });
    Swal.showLoading();

    const mapEmpresa = new Map<string, RentabilidadRow>();
    const mapVendedores = new Map<string, Map<string, RentabilidadRow>>();

    // Mantenemos las filas existentes pero en 0
    for (let r of this.tablaEmpresa) {
      const id = r.id || `${r.proveedor}|${r.medida}|${r.modelo}`;
      mapEmpresa.set(id, {
        ...r,
        id: id,
        costo: 0,
        costoOriginal: 0,
        total: 0,
        rentabilidad: 0,
        rentabilidadPorcentaje: 0
      });
    }

    for (let v of this.tablasVendedores) {
      const vMap = new Map<string, RentabilidadRow>();
      for (let r of v.rows) {
        const id = r.id || `${r.proveedor}|${r.medida}|${r.modelo}`;
        vMap.set(id, {
          ...r,
          id: id,
          costo: 0,
          costoOriginal: 0,
          total: 0,
          rentabilidad: 0,
          rentabilidadPorcentaje: 0
        });
      }
      mapVendedores.set(v.vendedor, vMap);
    }

    const rawRows = this.xmlobj
      .substring(this.xmlobj.indexOf('<ROWDATA>') + 9)
      .split('/>');

    const parsedData = [];

    for (let rawRow of rawRows) {
      if (!rawRow.trim()) continue;

      const provMatch = rawRow.match(/PROV_NOM_FANTASIA="([^"]*)"/);
      if (provMatch && provMatch[1] === "FACTURA A") {
        continue;
      }

      const vendedorMatch = rawRow.match(/VENDEDOR_DEL_CLIENTE="([^"]*)"/);
      if (vendedorMatch && vendedorMatch[1] === "VENTANILLA IVAN") {
        continue;
      }

      const medidaMatch = rawRow.match(/MEDIDA="([^"]*)"/);
      const modeloMatch = rawRow.match(/MODELO="([^"]*)"/);
      if (modeloMatch && (modeloMatch[1] === "PROMOCIONAL"
        || modeloMatch[1] === "MATERIAL PROMOCIONAL"
        || modeloMatch[1] === "ITEM")) {
        continue;
      }

      const costoMatch = rawRow.match(/COSTO_CANT="([^"]*)"/);
      const totalMatch = rawRow.match(/TOTAL="([^"]*)"/);
      const listaMatch = rawRow.match(/LISTA="([^"]*)"/);

      if (vendedorMatch) {
        parsedData.push({
          proveedor: provMatch ? provMatch[1] : "",
          vendedor: vendedorMatch[1],
          medida: medidaMatch ? medidaMatch[1] : "",
          modelo: modeloMatch ? modeloMatch[1] : "",
          lista: listaMatch ? listaMatch[1] : "",
          costo: costoMatch ? Number(costoMatch[1]) : 0,
          total: totalMatch ? Number(totalMatch[1]) : 0
        });
      }
    }

    for (let item of parsedData) {
      const key = `${item.proveedor}|${item.medida}|${item.modelo}`;

      // Update Empresa
      if (!mapEmpresa.has(key)) {
        mapEmpresa.set(key, {
          id: key,
          proveedor: item.proveedor,
          medida: item.medida,
          modelo: item.modelo,
          lista: item.lista,
          costo: 0,
          costoOriginal: 0,
          total: 0,
          rentabilidad: 0,
          rentabilidadPorcentaje: 0,
          dtoFinanciero: 0,
          dtoTransfer: 0,
          dtoTrimestral: 0,
          dtoDistribuidor: 0
        });
      }
      const empresaRow = mapEmpresa.get(key)!;
      empresaRow.costoOriginal += item.costo;
      empresaRow.costo = empresaRow.costoOriginal;
      empresaRow.total += item.total;

      // Update Vendedor
      if (!mapVendedores.has(item.vendedor)) {
        mapVendedores.set(item.vendedor, new Map<string, RentabilidadRow>());
      }
      const mapVendedorFilas = mapVendedores.get(item.vendedor)!;
      if (!mapVendedorFilas.has(key)) {
        mapVendedorFilas.set(key, {
          id: key,
          proveedor: item.proveedor,
          medida: item.medida,
          modelo: item.modelo,
          lista: item.lista,
          costo: 0,
          costoOriginal: 0,
          total: 0,
          rentabilidad: 0,
          rentabilidadPorcentaje: 0,
          dtoFinanciero: 0,
          dtoTransfer: 0,
          dtoTrimestral: 0,
          dtoDistribuidor: 0
        });
      }
      const vendedorRow = mapVendedorFilas.get(key)!;
      vendedorRow.costoOriginal += item.costo;
      vendedorRow.costo = vendedorRow.costoOriginal;
      vendedorRow.total += item.total;
    }

    this.tablaEmpresa = Array.from(mapEmpresa.values()).sort((a, b) => {
      const provCompare = a.proveedor.localeCompare(b.proveedor);
      return provCompare !== 0 ? provCompare : a.modelo.localeCompare(b.modelo);
    });

    const vends = Array.from(mapVendedores.entries());
    vends.sort((a, b) => a[0].localeCompare(b[0]));

    this.tablasVendedores = [];
    for (const [vendedor, mapFilas] of vends) {
      this.tablasVendedores.push({
        vendedor,
        rows: Array.from(mapFilas.values()).sort((a, b) => {
          const provCompare = a.proveedor.localeCompare(b.proveedor);
          return provCompare !== 0 ? provCompare : a.modelo.localeCompare(b.modelo);
        }),
        totales: { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 },
        totalesDistribuidor: { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 },
        totalesTradicional: { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 }
      });
    }

    this.recalcular();

    this.xmlobj = '';
    Swal.close();
  }

  recalcular() {
    this.totalesEmpresa = { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 };

    for (let empRow of this.tablaEmpresa) {
      empRow.costo = 0;
    }

    for (let v of this.tablasVendedores) {
      v.totales = { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 };
      v.totalesDistribuidor = { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 };
      v.totalesTradicional = { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 };
      const esDistribuidor = this.canalDistribuidor.includes(v.vendedor);
      const esDigital = this.canalDigital.includes(v.vendedor);

      for (let row of v.rows) {
        const empRow = this.tablaEmpresa.find(e => e.id === row.id);
        if (empRow) {
          row.dtoFinanciero = empRow.dtoFinanciero;
          row.dtoTransfer = empRow.dtoTransfer;
          row.dtoTrimestral = empRow.dtoTrimestral;
          row.dtoDistribuidor = empRow.dtoDistribuidor;
        }

        let descMult = (1 - (row.dtoFinanciero || 0) / 100) *
          (1 - (row.dtoTransfer || 0) / 100) *
          (1 - (row.dtoTrimestral || 0) / 100);
          
        let aplicaDtoDistribuidor = false;
        if (row.lista) {
          aplicaDtoDistribuidor = (row.lista === 'LISTA DISTRIBUIDORES');
        } else {
          aplicaDtoDistribuidor = esDistribuidor;
        }

        if (aplicaDtoDistribuidor) {
          descMult *= (1 - (row.dtoDistribuidor || 0) / 100);
        }

        row.costo = row.costoOriginal * descMult;
        row.rentabilidad = row.total - row.costo;
        row.rentabilidadPorcentaje = row.costo !== 0 ? (row.rentabilidad / row.costo) * 100 : 0;

        v.totales.costo += row.costo;
        v.totales.total += row.total;

        if (esDigital) {
          if (row.lista === 'LISTA DISTRIBUIDORES') {
            v.totalesDistribuidor!.costo += row.costo;
            v.totalesDistribuidor!.total += row.total;
          } else {
            v.totalesTradicional!.costo += row.costo;
            v.totalesTradicional!.total += row.total;
          }
        }

        if (empRow) {
          empRow.costo += row.costo;
        }
      }

      v.totales.rentabilidad = v.totales.total - v.totales.costo;
      v.totales.rentabilidadPorcentaje = v.totales.costo !== 0 ? (v.totales.rentabilidad / v.totales.costo) * 100 : 0;

      if (esDigital) {
        v.totalesDistribuidor!.rentabilidad = v.totalesDistribuidor!.total - v.totalesDistribuidor!.costo;
        v.totalesDistribuidor!.rentabilidadPorcentaje = v.totalesDistribuidor!.costo !== 0 ? (v.totalesDistribuidor!.rentabilidad / v.totalesDistribuidor!.costo) * 100 : 0;
        
        v.totalesTradicional!.rentabilidad = v.totalesTradicional!.total - v.totalesTradicional!.costo;
        v.totalesTradicional!.rentabilidadPorcentaje = v.totalesTradicional!.costo !== 0 ? (v.totalesTradicional!.rentabilidad / v.totalesTradicional!.costo) * 100 : 0;
      }
    }

    for (let empRow of this.tablaEmpresa) {
      empRow.rentabilidad = empRow.total - empRow.costo;
      empRow.rentabilidadPorcentaje = empRow.costo !== 0 ? (empRow.rentabilidad / empRow.costo) * 100 : 0;
      
      this.totalesEmpresa.costo += empRow.costo;
      this.totalesEmpresa.total += empRow.total;
    }

    this.totalesEmpresa.rentabilidad = this.totalesEmpresa.total - this.totalesEmpresa.costo;
    this.totalesEmpresa.rentabilidadPorcentaje = this.totalesEmpresa.costo !== 0 ? (this.totalesEmpresa.rentabilidad / this.totalesEmpresa.costo) * 100 : 0;

    this.agruparPorCanal();
  }

  agruparPorCanal() {
    const canalesMap = new Map<string, CanalData>();
    canalesMap.set('DIGITAL', { nombre: 'CANAL DIGITAL', vendedores: [], totales: { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 } });
    canalesMap.set('DISTRIBUIDOR', { nombre: 'CANAL DISTRIBUIDOR', vendedores: [], totales: { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 } });
    canalesMap.set('TRADICIONAL', { nombre: 'CANAL TRADICIONAL', vendedores: [], totales: { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 } });

    for (let v of this.tablasVendedores) {
      let canalKey = 'TRADICIONAL';
      if (this.canalDigital.includes(v.vendedor)) {
        canalKey = 'DIGITAL';
      } else if (this.canalDistribuidor.includes(v.vendedor)) {
        canalKey = 'DISTRIBUIDOR';
      }

      const canal = canalesMap.get(canalKey)!;
      canal.vendedores.push(v);
      canal.totales.costo += v.totales.costo;
      canal.totales.total += v.totales.total;
      canal.totales.rentabilidad += v.totales.rentabilidad;
    }

    for (let c of canalesMap.values()) {
      c.totales.rentabilidadPorcentaje = c.totales.costo !== 0 ? (c.totales.rentabilidad / c.totales.costo) * 100 : 0;
    }

    if (this.isDigital) {
      this.canales = [canalesMap.get('DIGITAL')!];
    } else {
      this.canales = [
        canalesMap.get('TRADICIONAL')!,
        canalesMap.get('DISTRIBUIDOR')!,
        canalesMap.get('DIGITAL')!
      ];
    }
  }

  guardarDatos() {
    Swal.fire({
      title: 'Espere!',
      text: 'Guardando datos',
      icon: 'info',
    });
    Swal.showLoading();

    const descuentosToSave = this.tablaEmpresa.map(item => ({
      id: item.id,
      proveedor: item.proveedor,
      medida: item.medida,
      modelo: item.modelo,
      dtoFinanciero: item.dtoFinanciero || 0,
      dtoTransfer: item.dtoTransfer || 0,
      dtoTrimestral: item.dtoTrimestral || 0,
      dtoDistribuidor: item.dtoDistribuidor || 0
    }));

    const datosToSave = {
      empresa: this.tablaEmpresa,
      totalesEmpresa: this.totalesEmpresa,
      vendedores: this.tablasVendedores
    };

    const reqDatos = this.firebaseService.updateRentabilidadDatos(this.mes.toString(), this.ano.toString(), datosToSave);
    const reqDescuentos = this.firebaseService.updateRentabilidadDescuentos(this.mes.toString(), this.ano.toString(), descuentosToSave);

    forkJoin([reqDatos, reqDescuentos]).subscribe({
      next: (responses) => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Datos y descuentos guardados correctamente',
          icon: 'success',
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Ocurrió un problema al guardar',
          icon: 'error',
        });
      }
    });
  }

  cargarDatos() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando datos históricos',
      icon: 'info',
    });
    Swal.showLoading();

    this.firebaseService.getRentabilidadDatos(this.mes.toString(), this.ano.toString()).subscribe({
      next: (data: any) => {
        if (data && data.empresa && data.empresa.length > 0) {
          this.tablaEmpresa = data.empresa.map((e: any) => ({
            ...e,
            id: e.id || `${e.proveedor}|${e.medida}|${e.modelo}`
          }));
          this.totalesEmpresa = data.totalesEmpresa || { costo: 0, total: 0, rentabilidad: 0, rentabilidadPorcentaje: 0 };
          this.tablasVendedores = data.vendedores.map((v: any) => ({
            ...v,
            rows: v.rows.map((r: any) => ({
              ...r,
              id: r.id || `${r.proveedor}|${r.medida}|${r.modelo}`
            }))
          })) || [];
          this.agruparPorCanal();
          Swal.close();
        } else {
          this.tablaEmpresa = [];
          this.tablasVendedores = [];
          Swal.fire({
            title: 'Atención',
            text: 'No hay datos guardados para el periodo seleccionado',
            icon: 'warning',
          });
        }
      },
      error: (err) => {
        console.error(err);
        Swal.fire({
          title: 'Error!',
          text: 'Hubo un problema al cargar los datos',
          icon: 'error',
        });
      }
    });
  }
}

