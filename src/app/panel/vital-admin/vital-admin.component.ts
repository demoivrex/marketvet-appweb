import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-vital-admin',
  templateUrl: './vital-admin.component.html',
  styleUrls: ['./vital-admin.component.css']
})
export class VitalAdminComponent implements OnInit {

  mes:number = 1;
  ano:number = new Date().getFullYear();
  xmlobj:string = '';
  kilosVital = [];
  unidadesVital = 0;
  unidadesUI = 0;
  unidadesTherapy = 0;
  therapyUI = 0;
  porcentualTherapy = 0;
  unidadesWet = 0;
  wetUI = 0;
  porcentualWet = 0;
  unidadesBalanced = 0;
  balancedUI = 0;
  porcentualBalanced = 0;
  unidadesComplete = 0;
  completeUI = 0;
  porcentualComplete = 0;
  unidadesBalancedNR = 0;
  balancedNRUI = 0;
  porcentualBalancedNR = 0;
  unidadesNutrique = 0;
  nutriqueUI = 0;
  porcentualNutrique = 0;
  ventasVital = 0;
  ventasUI = 0;
  precioMedioVital = 0;

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void {
    this.obtenerFecha();
  }

  obtenerFecha() {
    const today = new Date();
    this.mes = (today.getMonth() + 1);
  }

  buscarDatoMes(mes:number,ano:number) {
    this.firebaseService.getKilosVital(mes.toString(), ano.toString()).subscribe((data:any) => {
      if (data) {
        this.kilosVital = this.mapearDatos(data);
      } else {
        this.blanquearDatos();
      }
    });
  }

  procesarXML() {
    Swal.fire({
          title: 'Espere!',
          text: 'Procesando XML',
          icon: 'info',
        });
    Swal.showLoading();
    this.blanquearDatos();
    let listadoKg = this.generarArregloKg();

    for (let i = 0; i < listadoKg.length; i++) {
      const c = listadoKg[i];
      let obj = this.kilosVital.find(o => o.cliente === c.cliente);
      if (obj) {
        obj.ventas += c.ventas;
        obj = this.asignarModelo(obj, c);
        obj.kilos += c.kilos; 
      } else {
        this.kilosVital.push({
          cliente: c.cliente,
          ventas: c.ventas,
          kilos: c.kilos,
          extrakilos: 0,
          therapy: c.modelo == "THERAPY" ? c.kilos : 0,
          wet: c.modelo == "WET" ? c.kilos : 0,
          balanced: c.modelo == "BALANCED" ? c.kilos : 0,
          complete: c.modelo == "COMPLETE" ? c.kilos : 0,
          balancedNR: c.modelo == "BALANCED NR" ? c.kilos : 0,
          nutrique: c.modelo == "NUTRIQUE" ? c.kilos : 0,
        });
      }
    }  
    this.kilosVital = this.ajustarClientes(this.kilosVital);
    this.xmlobj = '';
    Swal.close();
  }

  recalcularUnidadesVital() {
    this.unidadesUI = this.unidadesVital;
    this.ventasUI = this.ventasVital;
    this.therapyUI = this.unidadesTherapy;
    this.wetUI = this.unidadesWet;
    this.balancedUI = this.unidadesBalanced;
    this.completeUI = this.unidadesComplete;
    this.balancedNRUI = this.unidadesBalancedNR;
    this.nutriqueUI = this.unidadesNutrique;
    let totalExtraKilos = 0;
    for (const item of this.kilosVital) {
      totalExtraKilos += Number(item.extrakilos);
    }
    this.unidadesUI -= totalExtraKilos;
    this.therapyUI -= totalExtraKilos * this.porcentualTherapy;
    this.wetUI -= totalExtraKilos * this.porcentualWet;
    this.balancedUI -= totalExtraKilos * this.porcentualBalanced;
    this.completeUI -= totalExtraKilos * this.porcentualComplete;
    this.balancedNRUI -= totalExtraKilos * this.porcentualBalancedNR;
    this.nutriqueUI -= totalExtraKilos * this.porcentualNutrique;
    this.ventasUI -= totalExtraKilos * this.precioMedioVital;
  }

  guardarCambios() {
    const kilos = [];
    Swal.fire({
          title: 'Espere!',
          text: 'Guardando datos',
          icon: 'info',
        });
    Swal.showLoading();
    for (const item of this.kilosVital) {
      kilos.push({
        cliente: item.cliente,
        kilos: item.kilos + Number(item.extrakilos),
        ventas: item.ventas + (Number(item.extrakilos) * this.precioMedioVital),
        therapy: item.therapy + (Number(item.extrakilos) * this.porcentualTherapy),
        wet: item.wet + (Number(item.extrakilos) * this.porcentualWet),
        balanced: item.balanced + (Number(item.extrakilos) * this.porcentualBalanced),
        complete: item.complete + (Number(item.extrakilos) * this.porcentualComplete),
        balancedNR: item.balancedNR + (Number(item.extrakilos) * this.porcentualBalancedNR),
        nutrique: item.nutrique + (Number(item.extrakilos) * this.porcentualNutrique)
      });
    }
    this.firebaseService.updateKilosVital(this.mes.toString(), this.ano.toString(), kilos).subscribe({
      next: (resp:any) => {
        if (!resp?.error) {
          Swal.close();
        }
      },
      error: (err) => {
        Swal.fire({
          title: 'Error!',
          text: 'Error al guardar los datos',
          icon: 'error',
        });
      }
    });
  }

  private asignarModelo(item:any, c:any) {
    switch (c.modelo) {
      case "THERAPY":
        item.therapy += c.kilos;
        break;
      case "WET":
        item.wet += c.kilos;
        break;
      case "BALANCED":
        item.balanced += c.kilos;
        break;
      case "COMPLETE":
        item.complete += c.kilos;
        break;
      case "BALANCED NR":
        item.balancedNR += c.kilos;
        break;
      case "NUTRIQUE":
        item.nutrique += c.kilos;
        break;
      default:
        console.log('Modelo no reconocido: ', c.modelo);
        break;
    }
    return item;
  }

  private mapearDatos(data:any) {
    return data.map(item => ({
      cliente: item.cliente,
      kilos: item.kilos,
      ventas: item.ventas,
      extrakilos: 0
    }))
  }

  private blanquearDatos() {
    this.kilosVital = [];
    this.unidadesVital = this.unidadesUI = 0;
    this.unidadesTherapy = this.therapyUI = 0;
    this.unidadesWet = this.wetUI = 0;
    this.unidadesBalanced = this.balancedUI = 0;
    this.unidadesComplete = this.completeUI = 0;
    this.unidadesBalancedNR = this.balancedNRUI = 0;
    this.unidadesNutrique = this.nutriqueUI = 0;
    this.ventasVital = this.ventasUI = 0;
    this.precioMedioVital = 0;
  }

  private generarArregloKg() {
    return this.xmlobj
      .substring(this.xmlobj.indexOf('<ROWDATA>') + 9)
      .split('/>')
      .map((item,i) => {
        var itemTemp = item.split('"');
        return {
          'cliente':itemTemp[1],
          'ventas': Number(itemTemp[15]) * 1.21, // Aplicar IVA del 21%
          'modelo': itemTemp[3],
          'kilos': Number(itemTemp[9]),
          }
        }
      )
  }

  private ajustarClientes(kilosVital) {
    const filtrados = kilosVital.filter(item => item.cliente !== undefined && item.cliente !== null && item.cliente !== '');
    const filtradosFinal = this.filtrarClientes(filtrados);
    const ordenados = filtradosFinal.sort((a, b) => b.kilos - a.kilos);
  return ordenados;
  }

  private filtrarClientes(kilosVital) {
    const filtrados = kilosVital.filter(item => {
      if (item.cliente && item.cliente.includes('*') ) {
        this.unidadesVital += item.kilos;
        this.unidadesTherapy += item.therapy;
        this.unidadesWet += item.wet;
        this.unidadesBalanced += item.balanced;
        this.unidadesComplete += item.complete;
        this.unidadesBalancedNR += item.balancedNR;
        this.unidadesNutrique += item.nutrique;
        this.ventasVital += item.ventas;
        return false;
      }
      return true;
    });
    this.calcularPrecioMedio();
    return filtrados;
  }

  private calcularPrecioMedio() {
    this.unidadesVital = Math.floor(this.unidadesVital);
    this.unidadesUI = this.unidadesVital;
    this.therapyUI = Math.floor(this.unidadesTherapy);
    this.wetUI = Math.floor(this.unidadesWet);
    this.balancedUI = Math.floor(this.unidadesBalanced);
    this.completeUI = Math.floor(this.unidadesComplete);
    this.balancedNRUI = Math.floor(this.unidadesBalancedNR);
    this.nutriqueUI = Math.floor(this.unidadesNutrique);
    this.ventasUI = this.ventasVital;
    this.precioMedioVital = this.ventasVital / this.unidadesVital;
    this.porcentualTherapy = this.unidadesTherapy / this.unidadesVital;
    this.porcentualWet = this.unidadesWet / this.unidadesVital;
    this.porcentualBalanced = this.unidadesBalanced / this.unidadesVital;
    this.porcentualComplete = this.unidadesComplete / this.unidadesVital;
    this.porcentualBalancedNR = this.unidadesBalancedNR / this.unidadesVital;
    this.porcentualNutrique = this.unidadesNutrique / this.unidadesVital;
  }
}
