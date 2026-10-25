import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-obj',
  templateUrl: './obj.component.html',
  styleUrls: ['./obj.component.css']
})
export class ObjComponent implements OnInit {

  trimestre:number = 1;
  xmlobj:string = '';
  objetivos = [];
  coefObjVentas = 0;
  coefObjUnidades = 0;
  coefObjKilos = 0;

  constructor(
    private router:Router,
    private fb: FirebaseService) 
  { }

  ngOnInit(): void {
  }

  buscarDatosObjetivos(trimestre:number) {
    console.log('TRIMESTRE: ', trimestre);
    return trimestre;
  }

  procesarXML() {
    let comprobantes = this.generarArregloCpr();
    for (let i = 0; i < comprobantes.length; i++) {
    
      const c = comprobantes[i];
      const obj = this.objetivos.find(o => o.vendedor === c.vendedorCliente);

      if (obj) {
        obj.objVentas += c.ventas;
        obj.objUnidades += c.unidades;
        obj.objKilos += c.kilos;
        obj.objArfv += c.arfv
        obj.objArfc += c.arfc
      } else {
        this.objetivos.push({
          vendedor: c.vendedorCliente,
          objVentas: c.ventas,
          objUnidades: c.unidades,
          objKilos: c.kilos,
          objArfv: c.arfv,
          objArfc: c.arfc,
          coefVendedor: 0,
          ventas: 0,
          coefVentas: 0,
          unidades: 0,
          coefUnidades: 0,
          kilos: 0,
          coefKilos: 0,
          canal: '',
        });
      }
    }  
    this.objetivos = this.aplicarCoeficiente(this.objetivos);
  }

  generarArregloCpr() {
    return this.xmlobj
      .substring(this.xmlobj.indexOf('<ROWDATA>') + 9)
      .split('/>')
      .map((item,i) => {
        var itemTemp = item.split('"');
        if (itemTemp.length == 39) {
          itemTemp.unshift('', '');
        }
        if (itemTemp[11] !== '3' &&  itemTemp[11] !== '4') {
          return { 
            'vendedorCliente':itemTemp[1],
            'ventas': Number(itemTemp[31]),
            'unidades': Number(itemTemp[25]),
            'kilos': Number(itemTemp[29]),
            'arfv': Number(itemTemp[35]),
            'arfc': Number(itemTemp[33])
          } 
        }
      })
      .filter(item => item !== undefined 
        && item.vendedorCliente !== ''
        && item.vendedorCliente !== 'VENTANILLA IVAN'
        && item.vendedorCliente !== 'MARKETVET SA');
  }

  aplicarCoeficiente(obj) {
    return obj.map(o => ({
      ...o,
      objVentas: o.objVentas * this.coefObjVentas / 3,
      objUnidades: o.objUnidades * this.coefObjUnidades / 3,
      objKilos: o.objKilos * this.coefObjKilos / 3,
    }));
  }

  guardarObjetivos() {
    let mes = this.trimestre * 0 + 1;
    const obj95 = this.objetivos.map(o => ({
      objVentas: o.objVentas * this.coefObjVentas * 0.95,
      objUnidades: o.objUnidades * this.coefObjUnidades * 0.95,
      objKilos: o.objKilos * this.coefObjKilos * 0.95,
    }));
    const obj105 = this.objetivos.map(o => ({
      objVentas: o.objVentas * this.coefObjVentas * 0.95,
      objUnidades: o.objUnidades * this.coefObjUnidades * 0.95,
      objKilos: o.objKilos * this.coefObjKilos * 0.95,
    })); 
    this.fb.updateObjetivos(this.objetivos,'2025',mes.toString()).subscribe();
    //const currentYear = new Date().getFullYear().toString();
    //this.fb.updateObjetivos(this.objetivos,currentYear,mes.toString()).subscribe();
  }

}
