import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//SERVICIO PARA ALMACENAR FUNCIONES UTILES
export class UtilService {

  constructor() { }

  //Funcion que permite obtener un arreglo con los dias de cada mes de un año ingresado por parametro.
  obtenerDiasMes(ano: number): number[] {
    var diasMes = [0];
    for(var i = 0; i < 12; i++){
      //El parametro 0 en el constructor de Date nos da el ultimo dia del mes anterior (nos determina la cantidad)
      var cantDias = new Date(ano, i+1, 0).getDate();
      diasMes[i+1] = cantDias;
    }
    return diasMes;
  }

  //Funcion que permite obtener la cantidad de dias de un mes y año ingresados por parametros.
  obtenerDiasMesPorAno(ano: number, mes: number): number {
      //El parametro 0 en el constructor de Date nos da el ultimo dia del mes anterior (nos determina la cantidad)
      var cantDias = new Date(ano, mes, 0).getDate();
    return cantDias;
  }
}
