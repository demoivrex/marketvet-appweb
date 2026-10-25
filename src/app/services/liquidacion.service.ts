import { Injectable } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { Empleado } from '../models/empleado.model';
import { Liquidacion } from '../models/liquidacion.model';

@Injectable({
  providedIn: 'root'
})
export class LiquidacionService {

  listaEmpleados: Empleado[] = [];
  liquidaciones: Liquidacion[] = [];
  
  constructor(private fb: FirebaseService) { 
    this.actualizarEmpleado();
  }

  actualizarEmpleado() {
    this.fb.getEmpleados().subscribe((resp: any) => {
      this.listaEmpleados = resp;
    });
  }

  generarLiquidacionMes(ano: string, mes: string): Liquidacion[] {
    this.actualizarEmpleado();
    if (this.listaEmpleados) {
      for (let i = 0; i < this.listaEmpleados.length; i++) {
        let adicionales = [];
        if (this.listaEmpleados[i].adicionales){
          adicionales = [].concat(this.listaEmpleados[i].adicionales);
        }
        const item = new Liquidacion(
          this.listaEmpleados[i].nombre,
          this.listaEmpleados[i].sector,
          this.listaEmpleados[i].objetivos,
          adicionales
        );
        this.liquidaciones.push(item);
      }
      this.fb.saveLiquidacion(this.liquidaciones, ano, mes).subscribe((resp) => {});
    }
    return this.liquidaciones;
  }

  agregarEmpleadosLiquidacion(ano: string, mes: string): void {
    this.actualizarEmpleado();
    this.fb.getLiquidacion(ano, mes).subscribe((resp: any) => {
      if (resp) {
        this.liquidaciones = resp;
        const item = new Liquidacion(
          this.listaEmpleados[this.listaEmpleados.length - 1].nombre,
          this.listaEmpleados[this.listaEmpleados.length - 1].sector,
          this.listaEmpleados[this.listaEmpleados.length - 1].objetivos,
          this.listaEmpleados[this.listaEmpleados.length - 1].adicionales
        );
        this.liquidaciones.push(item);
        this.fb.saveLiquidacion(this.liquidaciones, ano, mes).subscribe((resp) => {});
      }
    })
  }

  actualizarEmpleadosLiquidacion(ano: string, mes: string, empleado: Empleado): void {
    this.actualizarEmpleado();
    this.fb.getLiquidacion(ano, mes).subscribe((resp: any) => {
      if (resp) {
        this.liquidaciones = resp;
        this.liquidaciones.forEach(element => {
          if (element.nombre == empleado.nombre) {
            element.sector = empleado.sector;
            element.tienePremios = empleado.objetivos;
            element.agregadosBasicos = empleado.adicionales;
          }
        });
        this.fb.saveLiquidacion(this.liquidaciones, ano, mes).subscribe((resp) => {});
      }
    })
  }

}
