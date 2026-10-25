import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';

export interface ClienteDeuda {
  codigo: string;
  razonSocial: string;
  nombreFantasia: string;
  telefono: string;
  hasta45: number;
  hasta60: number;
  mas60: number;
  saldo: number;
}

export interface VendedorCuentas {
  vendedor: string;
  clientes: ClienteDeuda[];
  totalHasta45: number;
  totalHasta60: number;
  totalMas60: number;
  totalGeneral: number;
}

@Component({
  selector: 'app-cuenta-corriente',
  templateUrl: './cuenta-corriente.component.html',
  styleUrls: ['./cuenta-corriente.component.css']
})
export class CuentaCorrienteComponent implements OnInit {

  xmlobj: string = '';
  mes: number = 1;
  ano: number = new Date().getFullYear();

  vendedores: VendedorCuentas[] = [];
  totalesGenerales = { hasta45: 0, hasta60: 0, mas60: 0, total: 0 };

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    const today = new Date();
    this.mes = (today.getMonth() + 1);
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

    const mapVendedores = new Map<string, VendedorCuentas>();
    this.totalesGenerales = { hasta45: 0, hasta60: 0, mas60: 0, total: 0 };

    let contentToParse = this.xmlobj;
    if (contentToParse.includes('<ROWDATA>')) {
        contentToParse = contentToParse.substring(contentToParse.indexOf('<ROWDATA>') + 9);
    }
    
    const rawRows = contentToParse.split('/>');

    for (let rawRow of rawRows) {
      if (!rawRow.trim() || !rawRow.includes('COD_CLI=')) continue;

      const vendedorMatch = rawRow.match(/VENDEDOR_CLIENTE="([^"]*)"/);
      const codCliMatch = rawRow.match(/COD_CLI="([^"]*)"/);
      const rzMatch = rawRow.match(/RZ="([^"]*)"/);
      const nomFantasiaMatch = rawRow.match(/NOM_FANTASIA="([^"]*)"/);
      const telMatch = rawRow.match(/TELEFONO="([^"]*)"/);
      const hasta45Match = rawRow.match(/HASTA_45_DIAS="([^"]*)"/);
      const hasta60Match = rawRow.match(/HASTA_60_DIAS="([^"]*)"/);
      const mas60Match = rawRow.match(/MAS_DE_60_DIAS="([^"]*)"/);
      const saldoMatch = rawRow.match(/SALDO="([^"]*)"/);

      const vendedor = vendedorMatch ? vendedorMatch[1] : 'SIN VENDEDOR';

      if (vendedor === 'VENTANILLA IVAN' || vendedor === 'SIN VENDEDOR') {
        continue;
      }

      const codigo = codCliMatch ? codCliMatch[1] : '';
      const razonSocial = rzMatch ? rzMatch[1] : '';
      const nombreFantasia = nomFantasiaMatch ? nomFantasiaMatch[1] : '';
      const telefono = telMatch ? telMatch[1] : '';

      let rawHasta45 = hasta45Match ? parseFloat(hasta45Match[1]) : 0;
      let rawHasta60 = hasta60Match ? parseFloat(hasta60Match[1]) : 0;
      let rawMas60 = mas60Match ? parseFloat(mas60Match[1]) : 0;

      if (rawHasta45 <= 0 && rawHasta60 <= 0 && rawMas60 <= 0) {
        continue;
      }

      let hasta45 = rawHasta45 > 0 ? rawHasta45 : 0;
      let hasta60 = rawHasta60 > 0 ? rawHasta60 : 0;
      let mas60 = rawMas60 > 0 ? rawMas60 : 0;
      
      const saldo = hasta45 + hasta60 + mas60;

      const cliente: ClienteDeuda = {
        codigo,
        razonSocial,
        nombreFantasia,
        telefono,
        hasta45,
        hasta60,
        mas60,
        saldo
      };

      if (!mapVendedores.has(vendedor)) {
        mapVendedores.set(vendedor, {
          vendedor: vendedor,
          clientes: [],
          totalHasta45: 0,
          totalHasta60: 0,
          totalMas60: 0,
          totalGeneral: 0
        });
      }

      const vendedorObj = mapVendedores.get(vendedor)!;
      vendedorObj.clientes.push(cliente);
      vendedorObj.totalHasta45 += hasta45;
      vendedorObj.totalHasta60 += hasta60;
      vendedorObj.totalMas60 += mas60;
      vendedorObj.totalGeneral += saldo;

      this.totalesGenerales.hasta45 += hasta45;
      this.totalesGenerales.hasta60 += hasta60;
      this.totalesGenerales.mas60 += mas60;
      this.totalesGenerales.total += saldo;
    }

    if (mapVendedores.size === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'No se encontraron registros en el XML',
        icon: 'error',
      });
      return;
    }

    this.vendedores = Array.from(mapVendedores.values());
    // Sort vendors alphabetically
    this.vendedores.sort((a, b) => a.vendedor.localeCompare(b.vendedor));

    // Sort clients within vendors by reason social
    for (const v of this.vendedores) {
      v.clientes.sort((a, b) => a.razonSocial.localeCompare(b.razonSocial));
    }

    this.xmlobj = ''; // Clear input after processing
    Swal.close();
  }

  guardarDatos() {
    if (this.vendedores.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'No hay datos para guardar. Por favor, procese un XML primero.',
        icon: 'error',
      });
      return;
    }

    Swal.fire({
      title: 'Espere!',
      text: 'Guardando datos',
      icon: 'info',
    });
    Swal.showLoading();

    const datosToSave = {
      vendedores: this.vendedores,
      totalesGenerales: this.totalesGenerales
    };

    this.firebaseService.updateCuentaCorriente(this.mes.toString(), this.ano.toString(), datosToSave).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Éxito!',
          text: 'Datos de cuenta corriente guardados correctamente',
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

    this.firebaseService.getCuentaCorriente(this.mes.toString(), this.ano.toString()).subscribe({
      next: (data: any) => {
        if (data && data.vendedores && data.vendedores.length > 0) {
          this.vendedores = data.vendedores;
          this.totalesGenerales = data.totalesGenerales || { hasta45: 0, hasta60: 0, mas60: 0, total: 0 };
          Swal.close();
        } else {
          this.vendedores = [];
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
