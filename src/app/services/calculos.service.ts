import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalculosService {
  constructor() {}

  asignarColorSemaforo(valor: number): string {
    if (valor < 0.85) {
      return 'bg-danger';
    }
    if (valor > 0.85 && valor < 0.95) {
      return 'bg-naranja';
    }
    if (valor > 0.95) {
      return 'bg-success';
    }
  }

  asignarSemaforoSumatoria(valor: number): string {
    if (valor < 0) {
      return 'bg-naranja';
    }
    if (valor > 0) {
      return 'bg-info';
    }
  }

  asignarPorcentajeComision(valor: number): number {
    if (valor < 0.85) {
      return 0.002;
    }
    if (valor < 0.95 && valor > 0.85) {
      return 0.004;
    }
    if (valor > 0.95) {
      return 0.005;
    }
  }

  asignarPorcentajeComisionEspecialARF(coef: number, indice: number): number {
    if (indice == 5) {
      //PORCENTAJE COMISIÓN PARA IVAN
      if (coef < 0.85) {
        return 0.01;
      }
      if (coef < 0.95 && coef > 0.85) {
        return 0.025;
      }
      if (coef > 0.95) {
        return 0.05;
      }
    } else {
      //PORCENTAJE COMISION PARA WALTER
      if (coef < 0.85) {
        return 0.015;
      }
      if (coef < 0.95 && coef > 0.85) {
        return 0.02;
      }
      if (coef > 0.95) {
        return 0.025;
      }
    }
  }

  asignarPorcentajeComisionEspecialVtasTotalesTrad(
    coef: number,
    indice: number
  ): number {
    if (indice == 5) {
      //PORCENTAJE COMISIÓN PARA IVAN
      if (coef < 0.85) {
        return 0.001;
      }
      if (coef < 0.95 && coef > 0.85) {
        return 0.002;
      }
      if (coef > 0.95) {
        return 0.003;
      }
    } else {
      //PORCENTAJE COMISION PARA WALTER
      if (coef < 0.85) {
        return 0.002;
      }
      if (coef < 0.95 && coef > 0.85) {
        return 0.002;
      }
      if (coef > 0.95) {
        return 0.003;
      }
    }
  }

  asignarPorcentajeComisionARF(coef: number): number {
    if (coef < 0.85) {
      return 0.1;
    }
    if (coef < 0.95 && coef > 0.85) {
      return 0.15;
    }
    if (coef > 0.95) {
      return 0.2;
    }
  }

  asignarPorcentajeComisionARFWE(coef: number): number {
    if (coef < 0.85) {
      return 0.015;
    }
    if (coef < 0.95 && coef > 0.85) {
      return 0.02;
    }
    if (coef > 0.95) {
      return 0.025;
    }
  }

  asignarPorcentajeComisionARFIC(coef: number): number {
    if (coef < 0.85) {
      return 0.01;
    }
    if (coef < 0.95 && coef > 0.85) {
      return 0.025;
    }
    if (coef > 0.95) {
      return 0.05;
    }
  }

  asignarPorcentajeComisionEspecial(valor: number): number {
    if (valor < 0.85) {
      return 0.001;
    }
    if (valor < 0.95 && valor > 0.85) {
      return 0.002;
    }
    if (valor > 0.95) {
      return 0.003;
    }
  }

  asignarCoeficienteCanal(objetivos): number {
    let contador = 0;
    let sumatoria = 0;
    for (let i = 0; i < objetivos.length; i++) {
      contador++;
      sumatoria += objetivos[i].coeficiente;
    }
    return sumatoria / contador;
  }

  asignarTotal(cpr): number {
    return (
      ((cpr.efectivoA + cpr.chequeA + cpr.depositoA) * 0.05 * 75) / 100 +
      ((cpr.efectivoB + cpr.chequeB + cpr.depositoB) * 0.02 * 75) / 100
    );
  }

  asignarCobrado(cpr): number {
    return (
      cpr.efectivoA +
      cpr.chequeA +
      cpr.depositoA +
      cpr.efectivoB +
      cpr.chequeB +
      cpr.depositoB
    );
  }
}
