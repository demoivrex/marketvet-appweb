import { Adicional } from './../models/adicionales.model';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { FirebaseService } from './firebase.service';
import { LogModel } from '../models/LOG.model';

@Injectable({
  providedIn: 'root',
})

export class LogService {
  
  constructor(private fb: FirebaseService) {
    this.fb.getLogs().subscribe((resp:any) => {
      var auxLOG = resp;
      if (auxLOG) {
        this.cantPags = auxLOG.length;
        this.pageFolder = auxLOG.length-1;
        if (auxLOG[this.pageFolder].length>=this.MAX_LOGS) {
          this.pageFolder++;
        }
      } else {
        this.pageFolder = 0;
        this.cantPags = 0;
      }
    });
  }
  
  usuario:string = localStorage.getItem('user');;
  actualLOG:LogModel[] = [];
  pageFolder:number = 0;
  cantPags:number = 0;
  MAX_LOGS:number = 9;

  generarLog(seccion:string, accion:number, dato:any) {
    //console.log(accion, seccion, dato, "<-- PRUEBA");
    this.fb.getLogs().subscribe((resp:any) => {
      var auxLOG = resp;
      if (auxLOG) {
        this.cantPags = auxLOG.length;
        this.pageFolder = auxLOG.length-1;
        if (auxLOG[this.pageFolder].length>=this.MAX_LOGS) {
          this.pageFolder++;
        }
      } else {
        this.pageFolder = 0;
        this.cantPags = 0;
      }
      this.fb.getSpecificLog(this.pageFolder).subscribe((respuesta:any) => {
        this.actualLOG = respuesta;       
        //creación del string log
        var finalLOG:string = "";
        var fecha:string = this.generarFecha();
        var detalles:string = this.generarDetalles(accion, dato);
        var accionSTR:string = this.generarAccion(accion);
        finalLOG = fecha+";"+this.usuario+";"+seccion+";"+accionSTR+";"+detalles;
  
        if (!this.actualLOG){
          this.actualLOG = [];
        }
        
        this.actualLOG.push({registro: finalLOG, detallesPANEL: []});
        this.fb.putSpecificLog(this.actualLOG, this.pageFolder).subscribe((respuestita) => {});
      })   
    });
  }

  generarAccion(accion:number) {
    var accionSTR:string = "";
    switch (accion){
      case 1:
        accionSTR = "eliminar_totalidad_recibos";
        break;
      case 2:
        accionSTR = "eliminar_recibos_aprobados";
        break;
      case 3:
        accionSTR = "eliminar_recibo_concreto";
        break;
      case 4:
        accionSTR = "aprobar_recibo";
        break;
      case 5:
        accionSTR = "guardar_recibo";
        break;
      case 6:
        accionSTR = "desaprobar_recibo";
        break;
      case 7:
        accionSTR = "eliminacion_empleado";
        break;
      case 8:
        accionSTR = "edicion_empleado";
        break;
      case 9:
        accionSTR = "creacion_empleado";
        break;
      case 10:
        accionSTR = "edicion_adicional";
        break;
      case 11:
        accionSTR = "eliminacion_adicional";
        break;
      case 12:
        accionSTR = "creacion_adicional";
        break;
      case 13:
        accionSTR = "actualizacion_descuentos";
        break;
      case 14:
        accionSTR = "generacion_objetivos";
        break;
      case 15:
        accionSTR = "carga_objetivos_xml";
        break;
      case 16:
        accionSTR = "carga_objetivos_trimestrales";
        break;
      case 17:
        accionSTR = "generacion_liquidacion";
        break;
      case 18:
        accionSTR = "actualizacion_liquidacion";
        break;
    }
    return accionSTR;
  }

  generarDetalles(accion:number, dato:any) {
    var detalles = "";
    let prev = 0;
    let aumento = 55;
    let facturasPrimerColumna;
    let NC = 0;
    let ND = 0;
    let RC = 0;
    switch (accion) {
      case 1:
        //Acá calculamos la altura máxima de cada recibo para aplicarla a todos por igual
        /*let tamanioMaxDato = 0;
        let indexMaxDato = 0;
        let tamanioActual = 33;
        for (let i=0; i<dato.length; i++) {
          let caso = 0;
          if (dato[i].cheques) {
            caso += dato[i].cheques.length;
          }
          if (dato[i].depositos) {
            caso += dato[i].depositos.length;
          } 
          if (dato[i].facturas) {
            caso += dato[i].facturas.length;
          }

          if (caso>tamanioMaxDato) {
            tamanioMaxDato = caso;
            indexMaxDato = i;
          }
        }
        tamanioMaxDato = 33;
        if (dato[indexMaxDato].cheques){
          tamanioMaxDato += 3;
          tamanioMaxDato += dato[indexMaxDato].cheques.length*7;
        } 
        if (dato[indexMaxDato].depositos){
          tamanioMaxDato += 3;
          tamanioMaxDato += dato[indexMaxDato].depositos.length*6;
        } 
        if (dato[indexMaxDato].efectivo) {
          tamanioMaxDato += 4;
        }
        if (dato[indexMaxDato].facturas){
          tamanioMaxDato += dato[indexMaxDato].facturas.length*11;
        } else {
          tamanioMaxDato += 2;
        }
        */
        //

        detalles += "Eliminacion de la totalidad de los recibos.&FILTRO: "+dato[1]+"&­&";
        detalles += "LISTADO&­&";
        aumento*=dato[0].length;
        aumento/=3;
        for (let i=0; i<dato[0].length; i++) {
          //tamanioActual = 33;
          if (detalles.split('&').length-prev>aumento){
            detalles+="</&­&&­&&­&&­&";
            prev += aumento;
          }
          detalles += "RECIBO "+(i+1)+"&­&";
          detalles += "FECHA ⇨ "+dato[0][i].fecha+"&TOTAL ⇨ $"+dato[0][i].total+"&";
          detalles += "VENDEDOR ⇨ "+dato[0][i].vendedor+"&";
          if (dato[0][i].colorRecibo){
            detalles += "COLOR_RECIBO ⇨ ESQUEMA II&";
          } else {
            detalles += "COLOR_RECIBO ⇨ ESQUEMA I&";
          }
          detalles += "ESTADO ⇨ ";
          if (dato[0][i].aprobado) {
            detalles += "APROBADO&";
          } else {
            detalles += "NO APROBADO&";
          }      
          detalles += "EFECTIVO ⇨ $"+dato[0][i].efectivo+"&";
          detalles += "DESCUENTO ⇨ $"+dato[0][i].descuento+"&";
          detalles += "ID CLIENTE ⇨ "+dato[0][i].idCliente+"&";
          detalles += "FACTURAS SUBTOTAL $⇨ "+dato[0][i].subtotal+"&";

          let NC = 0;
          let ND = 0;
          let RC = 0;
          for (let i = 0; i < dato[0][i].facturas.length; i++) {
            if (dato[0][i].facturas[i].cpr_tipo_id == 'RC') {
              RC += dato[0][i].facturas[i].saldo;
            }
            if (dato[0][i].facturas[i].cpr_tipo_id == 'ND') {
              ND += dato[0][i].facturas[i].saldo;
            }
            if (dato[0][i].facturas[i].cpr_tipo_id == 'NC') {
              NC += dato[0][i].facturas[i].saldo;
            }
          }
          detalles += "NOTAS DE DÉBITO ⇨ $"+ND+"&";
          detalles += "NOTAS DE CRÉDITO ⇨ $"+NC+"&";
          detalles += "RECIBOS ⇨ $"+RC;
          
          detalles += "&­&<<Cliente>>&­&";
          detalles += "-NOMBRE FANTASÍA ⇨ "+dato[0][i].cliente.nombreFantasia+"&"; 
          detalles += "-NOMBRE SITUACIÓN ANTE IVA ⇨ "+dato[0][i].cliente.sit_ante_iva_nombre+"&";
          detalles += "-RAZÓN SOCIAL ⇨ "+dato[0][i].cliente.razonSocial+"&";
          detalles += "-RAZÓN SOCIAL POR EMPLEADO ⇨ [";
          for (let j=0; j<dato[0][i].cliente.empleados.length; j++){
            detalles += dato[0][i].cliente.empleados[j].razon_social;
            if (j!=dato[0][i].cliente.empleados.length-1){
              detalles += ", ";
            }
          }
          detalles += "]&";
          detalles += "-LOCALIDAD ⇨ "+dato[0][i].cliente.domicilios[0].localidad.nombre+"&";
          detalles += "-DOMICILIO ⇨ "+dato[0][i].cliente.domicilios[0].domicilio+"&";
          detalles += "-CUIT ⇨ "+dato[0][i].cliente.cuit;

          detalles += "&­&--Formas de pago:&­&"; //31
          if (dato[0][i].depositos) {
            detalles += "<<DEPÓSITOS>>&­&";
            detalles += "-TOTAL ⇨ $"+dato[0][i].cheque+"&";
            //tamanioActual += 3;
            for (let j = 0; j<dato[0][i].depositos.length; j++) {
              detalles += "N° "+(j+1)+":&";
              detalles += "-BANCO ⇨ "+dato[0][i].depositos[j].banco+"&";
              detalles += "-FECHA ⇨ "+dato[0][i].depositos[j].fecha+"&";
              detalles += "-NRO CPR ⇨ "+dato[0][i].depositos[j].nrcpr+"&";
              detalles += "-MONTO ⇨ $"+dato[0][i].depositos[j].importeBanco+"&­&";
              //tamanioActual += 6;
            }           
          }
          if (dato[0][i].cheques) {
            detalles += "<<CHEQUES>>&­&";
            detalles += "-TOTAL ⇨ $"+dato[0][i].cheque+"&";
            //tamanioActual += 3;
            for (let j = 0; j<dato[0][i].cheques.length; j++) {
              detalles += "N° "+(j+1)+":&";
              detalles += "-BANCO ⇨ "+dato[0][i].cheques[j].banco+"&";
              detalles += "-SUCURSAL ⇨ "+dato[0][i].cheques[j].nrosucursal+"&";
              detalles += "-NRO DE CHEQUE ⇨ "+dato[0][i].cheques[j].digitosCheque+"&";
              detalles += "-FECHA CONFIRMACIÓN ⇨ "+dato[0][i].cheques[j].fecha+"&";
              detalles += "-MONTO ⇨ $"+dato[0][i].cheques[j].importeCheque+"&­&";
            }           
            //tamanioActual += 7;
          }
          if (dato[0][i].efectivo) {
            detalles += "<<EFECTIVO>>&­&";
            detalles += "-TOTAL ⇨ $"+dato[0][i].efectivo+"&­&";
            //tamanioActual += 4;
          }
          detalles += "--Facturas:&­&"; //33
          if (dato[0][i].facturas) {
            for (let j=0; j<dato[0][i].facturas.length; j++){
              detalles += "N° "+(j+1)+":&";
              detalles += "*CPR_ID ⇨ "+dato[0][i].facturas[j].cprId+"&";
              detalles += "*FECHA_EMISION ⇨ "+dato[0][i].facturas[j].fecha_emision+"&";
              detalles += "*FECHA_VENCIMIENTO ⇨ "+dato[0][i].facturas[j].fecha_venc+"&";
              detalles += "*DÍAS ⇨ "+dato[0][i].facturas[j].dias+"&";
              detalles += "*Nro | Nro CPR ⇨ "+dato[0][i].facturas[j].nro+"|"+dato[0][i].facturas[j].nroCPR+"&";
              detalles += "*SALDO ⇨ $"+dato[0][i].facturas[j].saldo+"&";
              detalles += "*DESCUENTO ⇨ ("+dato[0][i].facturas[j].porcentajeDescuento+")% | ($"+dato[0][i].facturas[j].descuento+")&";
              detalles += "*MONTO ⇨ $"+dato[0][i].facturas[j].monto+"&";
              detalles += "*TIPO ⇨ "+dato[0][i].facturas[j].tipo+"&­&";
              //tamanioActual += 11;
            }
          } else {
            detalles += "# No tiene facturas. #&­&";
            //tamanioActual += 2;
          }
          //console.log(tamanioMaxDato, tamanioActual);
          //for (let j=0; j<tamanioMaxDato-tamanioActual; j++) {
          //  detalles += "&­&"; 
          //}
        }
        break;

      case 2:
        detalles += "Eliminación de recibos aprobados.&FILTRO: "+dato[1]+"&­&";
        detalles += "LISTADO&­&";
        aumento*=dato[0].length;
        aumento/=3;
        for (let i=0; i<dato[0].length; i++) {
          if (detalles.split('&').length-prev>aumento){
            detalles+="</&­&&­&&­&&­&";
            prev += aumento;
          }
          detalles += "RECIBO "+(i+1)+"&­&";
          detalles += "FECHA ⇨ "+dato[0][i].fecha+"&TOTAL ⇨ $"+dato[0][i].total+"&";
          detalles += "VENDEDOR ⇨ "+dato[0][i].vendedor+"&";
          if (dato[0][i].colorRecibo){
            detalles += "COLOR_RECIBO ⇨ ESQUEMA II&";
          } else {
            detalles += "COLOR_RECIBO ⇨ ESQUEMA I&";
          }
          detalles += "ESTADO ⇨ ";
          if (dato[0][i].aprobado) {
            detalles += "APROBADO&";
          } else {
            detalles += "NO APROBADO&";
          }      
          detalles += "EFECTIVO ⇨ $"+dato[0][i].efectivo+"&";
          detalles += "DESCUENTO ⇨ $"+dato[0][i].descuento+"&";
          detalles += "ID CLIENTE ⇨ "+dato[0][i].idCliente+"&";
          detalles += "FACTURAS SUBTOTAL ⇨ $"+dato[0][i].subtotal+"&";

          let NC = 0;
          let ND = 0;
          let RC = 0;
          for (let i = 0; i < dato[0][i].facturas.length; i++) {
            if (dato[0][i].facturas[i].cpr_tipo_id == 'RC') {
              RC += dato[0][i].facturas[i].saldo;
            }
            if (dato[0][i].facturas[i].cpr_tipo_id == 'ND') {
              ND += dato[0][i].facturas[i].saldo;
            }
            if (dato[0][i].facturas[i].cpr_tipo_id == 'NC') {
              NC += dato[0][i].facturas[i].saldo;
            }
          }
          detalles += "NOTAS DE DÉBITO ⇨ $"+ND+"&";
          detalles += "NOTAS DE CRÉDITO ⇨ $"+NC+"&";
          detalles += "RECIBOS ⇨ $"+RC;
          
          detalles += "&­&<<Cliente>>&­&";
          detalles += "-NOMBRE FANTASÍA ⇨ "+dato[0][i].cliente.nombreFantasia+"&"; 
          detalles += "-NOMBRE SITUACIÓN ANTE IVA ⇨ "+dato[0][i].cliente.sit_ante_iva_nombre+"&";
          detalles += "-RAZÓN SOCIAL ⇨ "+dato[0][i].cliente.razonSocial+"&";
          detalles += "-RAZÓN SOCIAL POR EMPLEADO ⇨ [";
          for (let j=0; j<dato[0][i].cliente.empleados.length; j++){
            detalles += dato[0][i].cliente.empleados[j].razon_social;
            if (j!=dato[0][i].cliente.empleados.length-1){
              detalles += ", ";
            }
          }
          detalles += "]&";
          detalles += "-LOCALIDAD ⇨ "+dato[0][i].cliente.domicilios[0].localidad.nombre+"&";
          detalles += "-DOMICILIO ⇨ "+dato[0][i].cliente.domicilios[0].domicilio+"&";
          detalles += "-CUIT ⇨ "+dato[0][i].cliente.cuit;

          detalles += "&­&--Formas de pago:&­&";
          if (dato[0][i].depositos) {
            detalles += "<<DEPÓSITOS>>&­&";
            detalles += "-TOTAL ⇨ $"+dato[0][i].cheque+"&";
            for (let j = 0; j<dato[0][i].depositos.length; j++) {
              detalles += "N° "+(j+1)+":&";
              detalles += "-BANCO ⇨ "+dato[0][i].depositos[j].banco+"&";
              detalles += "-FECHA ⇨ "+dato[0][i].depositos[j].fecha+"&";
              detalles += "-NRO CPR ⇨ "+dato[0][i].depositos[j].nrcpr+"&";
              detalles += "-MONTO ⇨ $"+dato[0][i].depositos[j].importeBanco+"&­&";
            }           
          }
          if (dato[0][i].cheques) {
            detalles += "<<CHEQUES>>&­&";
            detalles += "-TOTAL ⇨ $"+dato[0][i].cheque+"&";
            for (let j = 0; j<dato[0][i].cheques.length; j++) {
              detalles += "N° "+(j+1)+":&";
              detalles += "-BANCO ⇨ "+dato[0][i].cheques[j].banco+"&";
              detalles += "-SUCURSAL ⇨ "+dato[0][i].cheques[j].nrosucursal+"&";
              detalles += "-NRO DE CHEQUE ⇨ "+dato[0][i].cheques[j].digitosCheque+"&";
              detalles += "-FECHA CONFIRMACIÓN ⇨ "+dato[0][i].cheques[j].fecha+"&";
              detalles += "-MONTO ⇨ $"+dato[0][i].cheques[j].importeCheque+"&­&";
            }           
          }
          if (dato[0][i].efectivo) {
            detalles += "<<EFECTIVO>>&­&";
            detalles += "-TOTAL ⇨ $"+dato[0][i].efectivo+"&­&";
          }
          detalles += "--Facturas:&­&"; 
          if (dato[0][i].facturas) {
            for (let j=0; j<dato[0][i].facturas.length; j++){
              detalles += "N° "+(j+1)+":&";
              detalles += "*CPR_ID ⇨ "+dato[0][i].facturas[j].cprId+"&";
              detalles += "*FECHA_EMISION ⇨ "+dato[0][i].facturas[j].fecha_emision+"&";
              detalles += "*FECHA_VENCIMIENTO ⇨ "+dato[0][i].facturas[j].fecha_venc+"&";
              detalles += "*DÍAS ⇨ "+dato[0][i].facturas[j].dias+"&";
              detalles += "*Nro | Nro CPR ⇨ "+dato[0][i].facturas[j].nro+"|"+dato[0][i].facturas[j].nroCPR+"&";
              detalles += "*SALDO ⇨ $"+dato[0][i].facturas[j].saldo+"&";
              detalles += "*DESCUENTO ⇨ ("+dato[0][i].facturas[j].porcentajeDescuento+")% | ($"+dato[0][i].facturas[j].descuento+")&";
              detalles += "*MONTO ⇨ $"+dato[0][i].facturas[j].monto+"&";
              detalles += "*TIPO ⇨ "+dato[0][i].facturas[j].tipo+"&­&";
            }
          } else {
            detalles += "# No tiene facturas. #&­&";
          }
        }
        break;
      
      case 3:
        detalles += "Eliminación del siguiente recibo:&­&";
        detalles += "FECHA ⇨ "+dato.fecha+"&TOTAL ⇨ $"+dato.total+"&";
        detalles += "VENDEDOR ⇨ "+dato.vendedor+"&";
        if (dato.colorRecibo){
          detalles += "COLOR_RECIBO ⇨ ESQUEMA II&";
        } else {
          detalles += "COLOR_RECIBO ⇨ ESQUEMA I&";
        }
        detalles += "ESTADO ⇨ ";
        if (dato.aprobado) {
          detalles += "APROBADO&";
        } else {
          detalles += "NO APROBADO&";
        }      
        detalles += "EFECTIVO ⇨ $"+dato.efectivo+"&";
        detalles += "DESCUENTO ⇨ $"+dato.descuento+"&";
        detalles += "ID CLIENTE ⇨ "+dato.idCliente+"&";
        detalles += "FACTURAS SUBTOTAL ⇨ $"+dato.subtotal+"&";

        NC = 0;
        ND = 0;
        RC = 0;
        if (dato.facturas) {
          for (let i = 0; i < dato.facturas.length; i++) {
            if (dato.facturas.cpr_tipo_id == 'RC') {
              RC += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'ND') {
              ND += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'NC') {
              NC += dato.facturas.saldo;
            }
          }
        }
        detalles += "NOTAS DE DÉBITO ⇨ $"+ND+"&";
        detalles += "NOTAS DE CRÉDITO ⇨ $"+NC+"&";
        detalles += "RECIBOS ⇨ $"+RC;
          
        
        detalles += "&­&<<Cliente>>&­&";
        detalles += "-NOMBRE FANTASÍA ⇨ "+dato.cliente.nombreFantasia+"&"; 
        detalles += "-NOMBRE SITUACIÓN ANTE IVA ⇨ "+dato.cliente.sit_ante_iva_nombre+"&";
        detalles += "-RAZÓN SOCIAL ⇨ "+dato.cliente.razonSocial+"&";
        if (!dato.facturas) {
          detalles+="</&­&";
        }
        detalles += "-RAZÓN SOCIAL POR EMPLEADO ⇨ [";
        for (let j=0; j<dato.cliente.empleados.length; j++){
          detalles += dato.cliente.empleados[j].razon_social;
          if (j!=dato.cliente.empleados.length-1){
            detalles += ", ";
          }
        }
        detalles += "]&";
        detalles += "-LOCALIDAD ⇨ "+dato.cliente.domicilios[0].localidad.nombre+"&";
        detalles += "-DOMICILIO ⇨ "+dato.cliente.domicilios[0].domicilio+"&";
        detalles += "-CUIT ⇨ "+dato.cliente.cuit;

        if (dato.facturas) {
          if (dato.facturas.length < 4){
            detalles+="</&­&";
            prev += 1
          }
        }
        detalles += "&­&--Formas de pago:&­&";
        if (dato.depositos) {
          detalles += "<<DEPÓSITOS>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.depositos.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.depositos[j].banco+"&";
            detalles += "-FECHA ⇨ "+dato.depositos[j].fecha+"&";
            detalles += "-NRO CPR ⇨ "+dato.depositos[j].nrcpr+"&";
            detalles += "-MONTO ⇨ $"+dato.depositos[j].importeBanco+"&­&";
          }           
        }
        if (dato.cheques) {
          detalles += "<<CHEQUES>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.cheques.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.cheques[j].banco+"&";
            detalles += "-SUCURSAL ⇨ "+dato.cheques[j].nrosucursal+"&";
            detalles += "-NRO DE CHEQUE ⇨ "+dato.cheques[j].digitosCheque+"&";
            detalles += "-FECHA CONFIRMACIÓN ⇨ "+dato.cheques[j].fecha+"&";
            detalles += "-MONTO ⇨ $"+dato.cheques[j].importeCheque+"&­&";
          }           
        }
        if (dato.efectivo) {
          detalles += "<<EFECTIVO>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.efectivo+"&­&";
        }
        
        if (dato.facturas && prev != 1) {
          detalles += "</--Facturas:&­&"; 
        } else{
          detalles += "--Facturas:&­&";
        }
        
        if (dato.facturas) {
          facturasPrimerColumna = Math.floor((dato.facturas.length-3) / 2);
          for (let j=0; j<dato.facturas.length; j++){
            if (facturasPrimerColumna > 0 || prev==1) {
              facturasPrimerColumna -= 1;
            } else {
              if (j == Math.floor(dato.facturas.length/2)) {
                detalles+="</&­&&­&";    
              }
            }
            detalles += "N° "+(j+1)+":&";
            detalles += "*CPR_ID ⇨ "+dato.facturas[j].cprId+"&";
            detalles += "*FECHA_EMISION ⇨ "+dato.facturas[j].fecha_emision+"&";
            detalles += "*FECHA_VENCIMIENTO ⇨ "+dato.facturas[j].fecha_venc+"&";
            detalles += "*DÍAS ⇨ "+dato.facturas[j].dias+"&";
            detalles += "*Nro | Nro CPR ⇨ "+dato.facturas[j].nro+"|"+dato.facturas[j].nroCPR+"&";
            detalles += "*SALDO ⇨ $"+dato.facturas[j].saldo+"&";
            detalles += "*DESCUENTO ⇨ ("+dato.facturas[j].porcentajeDescuento+")% | ($"+dato.facturas[j].descuento+")&";
            detalles += "*MONTO ⇨ $"+dato.facturas[j].monto+"&";
            detalles += "*TIPO ⇨ $"+dato.facturas[j].tipo+"&­&";
          }
        } else {
            detalles += "# No tiene facturas. #&­&";
        }
        /*
        facturasPrimerColumna = Math.floor((dato.facturas.length - 4) / 2);
        if (dato.facturas) {
          for (let j=0; j<dato.facturas.length; j++){
            if (facturasPrimerColumna > 0) {
              facturasPrimerColumna -= 1;
            } else {
              
                Nos fijamos si el resto entre el iterador y las facturas en la primera columna
                alcanza la mitad de las facturas que quedan por mostrar.
              
              if (facturasPrimerColumna == 0){
                facturasPrimerColumna -= 1;
                detalles+="</&­&&­&";
              }
              if (j - Math.floor((dato.facturas.length - 4) / 2) == Math.floor((dato.facturas.length - Math.floor((dato.facturas.length - 4) / 2))/2)) {
                detalles+="</&­&&­&";    
              }
            }
            detalles += "N° "+(j+1)+":&";
            detalles += "*CPR_ID ⇨ "+dato.facturas[j].cprId+"&";
            detalles += "*FECHA_EMISION ⇨ "+dato.facturas[j].fecha_emision+"&";
            detalles += "*FECHA_VENCIMIENTO ⇨ "+dato.facturas[j].fecha_venc+"&";
            detalles += "*MONTO ⇨ "+dato.facturas[j].monto+"&";
            detalles += "*TIPO ⇨ "+dato.facturas[j].tipo+"&­&";
          }
        } else {
          detalles += "# No tiene facturas. #";
        }
        detalles += "&­&";
        */
        break;

      case 4:
        detalles += "Aprobación del siguiente recibo:&­&";
        detalles += "FECHA ⇨ "+dato.fecha+"&TOTAL $⇨ "+dato.total+"&";
        detalles += "VENDEDOR ⇨ "+dato.vendedor+"&";
        if (dato.colorRecibo){
          detalles += "COLOR_RECIBO ⇨ ESQUEMA II&";
        } else {
          detalles += "COLOR_RECIBO ⇨ ESQUEMA I&";
        }
        detalles += "ESTADO ⇨ ";
        if (dato.aprobado) {
          detalles += "APROBADO&";
        } else {
          detalles += "NO APROBADO&";
        }      
        detalles += "EFECTIVO ⇨ $"+dato.efectivo+"&";
        detalles += "DESCUENTO ⇨ $"+dato.descuento+"&";
        detalles += "ID CLIENTE ⇨ "+dato.idCliente+"&";
        detalles += "FACTURAS SUBTOTAL ⇨ $"+dato.subtotal+"&";

        NC = 0;
        ND = 0;
        RC = 0;
        if (dato.facturas) {
          for (let i = 0; i < dato.facturas.length; i++) {
            if (dato.facturas.cpr_tipo_id == 'RC') {
              RC += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'ND') {
              ND += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'NC') {
              NC += dato.facturas.saldo;
            }
          }
        }
        detalles += "NOTAS DE DÉBITO ⇨ $"+ND+"&";
        detalles += "NOTAS DE CRÉDITO ⇨ $"+NC+"&";
        detalles += "RECIBOS ⇨ $"+RC;
          
        
        detalles += "&­&<<Cliente>>&­&";
        detalles += "-NOMBRE FANTASÍA ⇨ "+dato.cliente.nombreFantasia+"&"; 
        detalles += "-NOMBRE SITUACIÓN ANTE IVA ⇨ "+dato.cliente.sit_ante_iva_nombre+"&";
        detalles += "-RAZÓN SOCIAL ⇨ "+dato.cliente.razonSocial+"&";
        if (!dato.facturas) {
          detalles+="</&­&";
        }
        detalles += "-RAZÓN SOCIAL POR EMPLEADO ⇨ [";
        for (let j=0; j<dato.cliente.empleados.length; j++){
          detalles += dato.cliente.empleados[j].razon_social;
          if (j!=dato.cliente.empleados.length-1){
            detalles += ", ";
          }
        }
        detalles += "]&";
        detalles += "-LOCALIDAD ⇨ "+dato.cliente.domicilios[0].localidad.nombre+"&";
        detalles += "-DOMICILIO ⇨ "+dato.cliente.domicilios[0].domicilio+"&";
        detalles += "-CUIT ⇨ "+dato.cliente.cuit;

        if (dato.facturas) {
          if (dato.facturas.length < 4){
            detalles+="</&­&";
            prev += 1
          }
        }
        detalles += "&­&--Formas de pago:&­&";
        if (dato.depositos) {
          detalles += "<<DEPÓSITOS>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.depositos.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.depositos[j].banco+"&";
            detalles += "-FECHA ⇨ "+dato.depositos[j].fecha+"&";
            detalles += "-NRO CPR ⇨ "+dato.depositos[j].nrcpr+"&";
            detalles += "-MONTO ⇨ $"+dato.depositos[j].importeBanco+"&­&";
          }           
        }
        if (dato.cheques) {
          detalles += "<<CHEQUES>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.cheques.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.cheques[j].banco+"&";
            detalles += "-SUCURSAL ⇨ "+dato.cheques[j].nrosucursal+"&";
            detalles += "-NRO DE CHEQUE ⇨ "+dato.cheques[j].digitosCheque+"&";
            detalles += "-FECHA CONFIRMACIÓN ⇨ "+dato.cheques[j].fecha+"&";
            detalles += "-MONTO ⇨ $"+dato.cheques[j].importeCheque+"&­&";
          }           
        }
        if (dato.efectivo) {
          detalles += "<<EFECTIVO>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.efectivo+"&­&";
        }
        
        if (dato.facturas && prev != 1) {
          detalles += "</--Facturas:&­&"; 
        } else{
          detalles += "--Facturas:&­&";
        }
        
        if (dato.facturas) {
          facturasPrimerColumna = Math.floor((dato.facturas.length-3) / 2);
          for (let j=0; j<dato.facturas.length; j++){
            if (facturasPrimerColumna > 0 || prev==1) {
              facturasPrimerColumna -= 1;
            } else {
              if (j == Math.floor(dato.facturas.length/2)) {
                detalles+="</&­&&­&";    
              }
            }
            detalles += "N° "+(j+1)+":&";
            detalles += "*CPR_ID ⇨ "+dato.facturas[j].cprId+"&";
            detalles += "*FECHA_EMISION ⇨ "+dato.facturas[j].fecha_emision+"&";
            detalles += "*FECHA_VENCIMIENTO ⇨ "+dato.facturas[j].fecha_venc+"&";
            detalles += "*DÍAS ⇨ "+dato.facturas[j].dias+"&";
            detalles += "*Nro | Nro CPR ⇨ "+dato.facturas[j].nro+"|"+dato.facturas[j].nroCPR+"&";
            detalles += "*SALDO ⇨ $"+dato.facturas[j].saldo+"&";
            detalles += "*DESCUENTO ⇨ ("+dato.facturas[j].porcentajeDescuento+")% | ($"+dato.facturas[j].descuento+")&";
            detalles += "*MONTO ⇨ $"+dato.facturas[j].monto+"&";
            detalles += "*TIPO ⇨ "+dato.facturas[j].tipo+"&­&";
          }
        } else {
            detalles += "# No tiene facturas. #&­&";
        }
        break;

      case 5:
        detalles += "Guardado del siguiente recibo:&­&";
        detalles += "FECHA ⇨ "+dato.fecha+"&TOTAL ⇨ $"+dato.total+"&";
        detalles += "VENDEDOR ⇨ "+dato.vendedor+"&";
        if (dato.colorRecibo){
          detalles += "COLOR_RECIBO ⇨ ESQUEMA II&";
        } else {
          detalles += "COLOR_RECIBO ⇨ ESQUEMA I&";
        }
        detalles += "ESTADO ⇨ ";
        if (dato.aprobado) {
          detalles += "APROBADO&";
        } else {
          detalles += "NO APROBADO&";
        }      
        detalles += "EFECTIVO ⇨ $"+dato.efectivo+"&";
        detalles += "DESCUENTO ⇨ $"+dato.descuento+"&";
        detalles += "ID CLIENTE ⇨ "+dato.idCliente+"&";
        detalles += "FACTURAS SUBTOTAL ⇨ $"+dato.subtotal+"&";

        NC = 0;
        ND = 0;
        RC = 0;
        if (dato.facturas) {
          for (let i = 0; i < dato.facturas.length; i++) {
            if (dato.facturas.cpr_tipo_id == 'RC') {
              RC += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'ND') {
              ND += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'NC') {
              NC += dato.facturas.saldo;
            }
          }
        }
        detalles += "NOTAS DE DÉBITO ⇨ $"+ND+"&";
        detalles += "NOTAS DE CRÉDITO ⇨ $"+NC+"&";
        detalles += "RECIBOS ⇨ $"+RC;
          
        
        detalles += "&­&<<Cliente>>&­&";
        detalles += "-NOMBRE FANTASÍA ⇨ "+dato.cliente.nombreFantasia+"&"; 
        detalles += "-NOMBRE SITUACIÓN ANTE IVA ⇨ "+dato.cliente.sit_ante_iva_nombre+"&";
        detalles += "-RAZÓN SOCIAL ⇨ "+dato.cliente.razonSocial+"&";
        if (!dato.facturas) {
          detalles+="</&­&";
        }
        detalles += "-RAZÓN SOCIAL POR EMPLEADO ⇨ [";
        for (let j=0; j<dato.cliente.empleados.length; j++){
          detalles += dato.cliente.empleados[j].razon_social;
          if (j!=dato.cliente.empleados.length-1){
            detalles += ", ";
          }
        }
        detalles += "]&";
        detalles += "-LOCALIDAD ⇨ "+dato.cliente.domicilios[0].localidad.nombre+"&";
        detalles += "-DOMICILIO ⇨ "+dato.cliente.domicilios[0].domicilio+"&";
        detalles += "-CUIT ⇨ "+dato.cliente.cuit;

        if (dato.facturas) {
          if (dato.facturas.length < 4){
            detalles+="</&­&";
            prev += 1
          }
        }
        detalles += "&­&--Formas de pago:&­&";
        if (dato.depositos) {
          detalles += "<<DEPÓSITOS>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.depositos.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.depositos[j].banco+"&";
            detalles += "-FECHA ⇨ "+dato.depositos[j].fecha+"&";
            detalles += "-NRO CPR ⇨ "+dato.depositos[j].nrcpr+"&";
            detalles += "-MONTO ⇨ $"+dato.depositos[j].importeBanco+"&­&";
          }           
        }
        if (dato.cheques) {
          detalles += "<<CHEQUES>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.cheques.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.cheques[j].banco+"&";
            detalles += "-SUCURSAL ⇨ "+dato.cheques[j].nrosucursal+"&";
            detalles += "-NRO DE CHEQUE ⇨ "+dato.cheques[j].digitosCheque+"&";
            detalles += "-FECHA CONFIRMACIÓN ⇨ "+dato.cheques[j].fecha+"&";
            detalles += "-MONTO ⇨ $"+dato.cheques[j].importeCheque+"&­&";
          }           
        }
        if (dato.efectivo) {
          detalles += "<<EFECTIVO>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.efectivo+"&­&";
        }
        
        if (dato.facturas && prev != 1) {
          detalles += "</--Facturas:&­&"; 
        } else{
          detalles += "--Facturas:&­&";
        }
        
        if (dato.facturas) {
          facturasPrimerColumna = Math.floor((dato.facturas.length-3) / 2);
          for (let j=0; j<dato.facturas.length; j++){
            if (facturasPrimerColumna > 0 || prev==1) {
              facturasPrimerColumna -= 1;
            } else {
              if (j == Math.floor(dato.facturas.length/2)) {
                detalles+="</&­&&­&";    
              }
            }
            detalles += "N° "+(j+1)+":&";
            detalles += "*CPR_ID ⇨ "+dato.facturas[j].cprId+"&";
            detalles += "*FECHA_EMISION ⇨ "+dato.facturas[j].fecha_emision+"&";
            detalles += "*FECHA_VENCIMIENTO ⇨ "+dato.facturas[j].fecha_venc+"&";
            detalles += "*DÍAS ⇨ "+dato.facturas[j].dias+"&";
            detalles += "*Nro | Nro CPR ⇨ "+dato.facturas[j].nro+"|"+dato.facturas[j].nroCPR+"&";
            detalles += "*SALDO ⇨ $"+dato.facturas[j].saldo+"&";
            detalles += "*DESCUENTO ⇨ ("+dato.facturas[j].porcentajeDescuento+")% | ($"+dato.facturas[j].descuento+")&";
            detalles += "*MONTO ⇨ $"+dato.facturas[j].monto+"&";
            detalles += "*TIPO ⇨ "+dato.facturas[j].tipo+"&­&";
          }
        } else {
            detalles += "# No tiene facturas. #&­&";
        }
        break;
      
      case 6:
        detalles += "Desaprobación del siguiente recibo:&­&";
        detalles += "FECHA ⇨ "+dato.fecha+"&TOTAL ⇨ $"+dato.total+"&";
        detalles += "VENDEDOR ⇨ "+dato.vendedor+"&";
        if (dato.colorRecibo){
          detalles += "COLOR_RECIBO ⇨ ESQUEMA II&";
        } else {
          detalles += "COLOR_RECIBO ⇨ ESQUEMA I&";
        }
        detalles += "ESTADO ⇨ ";
        if (dato.aprobado) {
          detalles += "APROBADO&";
        } else {
          detalles += "NO APROBADO&";
        }      
        detalles += "EFECTIVO ⇨ $"+dato.efectivo+"&";
        detalles += "DESCUENTO ⇨ $"+dato.descuento+"&";
        detalles += "ID CLIENTE ⇨ "+dato.idCliente+"&";
        detalles += "FACTURAS SUBTOTAL ⇨ $"+dato.subtotal+"&";

        NC = 0;
        ND = 0;
        RC = 0;
        if (dato.facturas) {
          for (let i = 0; i < dato.facturas.length; i++) {
            if (dato.facturas.cpr_tipo_id == 'RC') {
              RC += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'ND') {
              ND += dato.facturas.saldo;
            }
            if (dato.facturas.cpr_tipo_id == 'NC') {
              NC += dato.facturas.saldo;
            }
          }
        }
        detalles += "NOTAS DE DÉBITO ⇨ $"+ND+"&";
        detalles += "NOTAS DE CRÉDITO ⇨ $"+NC+"&";
        detalles += "RECIBOS ⇨ $"+RC;
          
        
        detalles += "&­&<<Cliente>>&­&";
        detalles += "-NOMBRE FANTASÍA ⇨ "+dato.cliente.nombreFantasia+"&"; 
        detalles += "-NOMBRE SITUACIÓN ANTE IVA ⇨ "+dato.cliente.sit_ante_iva_nombre+"&";
        detalles += "-RAZÓN SOCIAL ⇨ "+dato.cliente.razonSocial+"&";
        if (!dato.facturas) {
          detalles+="</&­&";
        }
        detalles += "-RAZÓN SOCIAL POR EMPLEADO ⇨ [";
        for (let j=0; j<dato.cliente.empleados.length; j++){
          detalles += dato.cliente.empleados[j].razon_social;
          if (j!=dato.cliente.empleados.length-1){
            detalles += ", ";
          }
        }
        detalles += "]&";
        detalles += "-LOCALIDAD ⇨ "+dato.cliente.domicilios[0].localidad.nombre+"&";
        detalles += "-DOMICILIO ⇨ "+dato.cliente.domicilios[0].domicilio+"&";
        detalles += "-CUIT ⇨ "+dato.cliente.cuit;

        if (dato.facturas) {
          if (dato.facturas.length < 4){
            detalles+="</&­&";
            prev += 1
          }
        }
        detalles += "&­&--Formas de pago:&­&";
        if (dato.depositos) {
          detalles += "<<DEPÓSITOS>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.depositos.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.depositos[j].banco+"&";
            detalles += "-FECHA ⇨ "+dato.depositos[j].fecha+"&";
            detalles += "-NRO CPR ⇨ "+dato.depositos[j].nrcpr+"&";
            detalles += "-MONTO ⇨ $"+dato.depositos[j].importeBanco+"&­&";
          }           
        }
        if (dato.cheques) {
          detalles += "<<CHEQUES>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.cheque+"&";
          for (let j = 0; j<dato.cheques.length; j++) {
            detalles += "N° "+(j+1)+":&";
            detalles += "-BANCO ⇨ "+dato.cheques[j].banco+"&";
            detalles += "-SUCURSAL ⇨ "+dato.cheques[j].nrosucursal+"&";
            detalles += "-NRO DE CHEQUE ⇨ "+dato.cheques[j].digitosCheque+"&";
            detalles += "-FECHA CONFIRMACIÓN ⇨ "+dato.cheques[j].fecha+"&";
            detalles += "-MONTO ⇨ $"+dato.cheques[j].importeCheque+"&­&";
          }           
        }
        if (dato.efectivo) {
          detalles += "<<EFECTIVO>>&­&";
          detalles += "-TOTAL ⇨ $"+dato.efectivo+"&­&";
        }
        
        if (dato.facturas && prev != 1) {
          detalles += "</--Facturas:&­&"; 
        } else{
          detalles += "--Facturas:&­&";
        }
        
        if (dato.facturas) {
          facturasPrimerColumna = Math.floor((dato.facturas.length-3) / 2);
          for (let j=0; j<dato.facturas.length; j++){
            if (facturasPrimerColumna > 0 || prev==1) {
              facturasPrimerColumna -= 1;
            } else {
              if (j == Math.floor(dato.facturas.length/2)) {
                detalles+="</&­&&­&";    
              }
            }
            detalles += "N° "+(j+1)+":&";
            detalles += "*CPR_ID ⇨ "+dato.facturas[j].cprId+"&";
            detalles += "*FECHA_EMISION ⇨ "+dato.facturas[j].fecha_emision+"&";
            detalles += "*FECHA_VENCIMIENTO ⇨ "+dato.facturas[j].fecha_venc+"&";
            detalles += "*DÍAS ⇨ "+dato.facturas[j].dias+"&";
            detalles += "*Nro | Nro CPR ⇨ "+dato.facturas[j].nro+"|"+dato.facturas[j].nroCPR+"&";
            detalles += "*SALDO ⇨ $"+dato.facturas[j].saldo+"&";
            detalles += "*DESCUENTO ⇨ ("+dato.facturas[j].porcentajeDescuento+")% | ($"+dato.facturas[j].descuento+")&";
            detalles += "*MONTO ⇨ $"+dato.facturas[j].monto+"&";
            detalles += "*TIPO ⇨ "+dato.facturas[j].tipo+"&­&";
          }
        } else {
            detalles += "# No tiene facturas. #&­&";
        }
        break;

      case 7:
        detalles += "Empleado eliminado:&­&NOMBRE ⇨ "+dato.nombre+"&LEGAJO ⇨ "+dato.legajo+"</&­&&­&";
        detalles += "SECTOR ⇨ "+dato.sector+"&OBJETIVOS ⇨ "+dato.objetivos;
        /*detalles += "&OBJETIVOS ⇨ "+dato.objetivos+"&­&--Adicionales:&­&";
        if (!dato.adicionales) {
          dato.adicionales = [];
        }
        if (dato.adicionales.length==0) {
          detalles += "# No tiene adicionales. #&­&";
        }
        for (let i=0; i<dato.adicionales.length; i++){ 
          detalles += "N° "+(i+1)+":&"
          detalles += "*IDENTIFICADOR ⇨ "+dato.adicionales[i].identificador+"&*COEFICIENTE ⇨ "+dato.adicionales[i].coeficiente;
          detalles += "&­&";
        }*/
        break;

      case 8:
        detalles += "Empleado pre-edición:&­&NOMBRE ⇨ "+dato[0].nombre+"&LEGAJO ⇨ "+dato[0].legajo+"&SECTOR ⇨ "+dato[0].sector;
        detalles += "&OBJETIVOS ⇨ "+dato[0].objetivos+"</";   
        /*detalles += "&OBJETIVOS ⇨ "+dato[0].objetivos+"&­&--Adicionales:&­&";
        if (!dato[0].adicionales) {
          dato[0].adicionales = [];
        }
        if (dato[0].adicionales.length==0) {
          detalles += "# No tiene adicionales. #&­&";
        }
        for (let i=0; i<dato[0].adicionales.length; i++){ 
          detalles += "N° "+(i+1)+":&"
          detalles += "*IDENTIFICADOR ⇨ "+dato[0].adicionales[i].identificador+"&*COEFICIENTE ⇨ "+dato[0].adicionales[i].coeficiente;
          detalles += "&­&";
        }*/
        detalles += "Empleado post-edición:&­&NOMBRE ⇨ "+dato[1].nombre+"&LEGAJO ⇨ "+dato[1].legajo+"&SECTOR ⇨ "+dato[1].sector;
        detalles += "&OBJETIVOS ⇨ "+dato[1].objetivos;
        /*detalles += "&OBJETIVOS ⇨ "+dato[1].objetivos+"&­&--Adicionales:&­&";
        if (!dato[1].adicionales) {
          dato[1].adicionales = [];
        }
        if (dato[1].adicionales.length==0) {
          detalles += "# No tiene adicionales. #&­&";
        }
        for (let i=0; i<dato[1].adicionales.length; i++){ 
          detalles += "N° "+(i+1)+":&"
          detalles += "*IDENTIFICADOR ⇨ "+dato[1].adicionales[i].identificador+"&*COEFICIENTE ⇨ "+dato[1].adicionales[i].coeficiente;
          detalles += "&­&";
        }*/
        break;

      case 9:
        detalles += "Empleado creado:&­&NOMBRE ⇨ "+dato.nombre+"&LEGAJO ⇨ "+dato.legajo+"</&­&&­&";
        detalles += "SECTOR ⇨ "+dato.sector+"&OBJETIVOS ⇨ "+dato.objetivos;
        /*detalles += "&OBJETIVOS ⇨ "+dato.objetivos+"&­&--Adicionales:&­&";
        if (!dato.adicionales) {
          dato.adicionales = [];
        }
        if (dato.adicionales.length==0) {
          detalles += "# No tiene adicionales. #&­&";
        }
        for (let i=0; i<dato.adicionales.length; i++){ 
          detalles += "N° "+(i+1)+":&"
          detalles += "*IDENTIFICADOR ⇨ "+dato.adicionales[i].identificador+"&*COEFICIENTE ⇨ "+dato.adicionales[i].coeficiente;
          detalles += "&­&";
        }*/
        break;

      case 10:
        detalles += "Adicional pre-modificación:&­&IDENTIFICADOR ⇨ "+dato[0].identificador+"&COEFICIENTE ⇨ "+dato[0].coeficiente+".&­&";
        detalles += "Adicional post-modificación:&­&IDENTIFICADOR ⇨ "+dato[1].identificador+"&COEFICIENTE ⇨ "+dato[1].coeficiente+".</";
        detalles += "Empleado asociado:&­&NOMBRE ⇨ "+dato[2].nombre+"&LEGAJO ⇨ "+dato[2].legajo+"&SECTOR ⇨ "+dato[2].sector;
        detalles += "&OBJETIVOS ⇨ "+dato[2].objetivos+"&­&";
        if (!dato[2].adicionales) {
          dato[2].adicionales = [];
        }
        if (dato[2].adicionales.length<3) {
          detalles += "</--Adicionales del empleado:&­&"; 
        } else {
          detalles += "--Adicionales del empleado:&­&";
        }
        if (dato[2].adicionales.length==0) {
          detalles += "# No tiene adicionales. #&­&";
        }
        for (let i=0; i<dato[2].adicionales.length; i++){ 
          if (i == Math.floor((dato[2].adicionales.length - 1) / 2) && i!=0) {
            detalles += "</&­&&­&";
          }
          detalles += "N° "+(i+1)+":&"
          detalles += "*IDENTIFICADOR ⇨ "+dato[2].adicionales[i].identificador+"&*COEFICIENTE ⇨ "+dato[2].adicionales[i].coeficiente;
          detalles += "&­&";
        }
        break;

      case 11:
        detalles += "Adicional eliminado:&­&IDENTIFICADOR ⇨ "+dato[0].identificador+"&COEFICIENTE ⇨ "+dato[0].coeficiente+".&­&";
        detalles += "Empleado asociado:&­&NOMBRE ⇨ "+dato[1].nombre+"&LEGAJO ⇨ "+dato[1].legajo+"&SECTOR ⇨ "+dato[1].sector;
        detalles += "&OBJETIVOS ⇨ "+dato[1].objetivos+"&­&";
        if (!dato[1].adicionales) {
          dato[1].adicionales = [];
        }
        if (dato[1].adicionales.length<5) {
          detalles += "</--Adicionales del empleado:&­&"; 
        } else {
          detalles += "--Adicionales del empleado:&­&";
        }
        if (dato[1].adicionales.length==0) {
          detalles += "# No tiene adicionales. #&­&";
        }
        for (let i=0; i<dato[1].adicionales.length; i++){ 
          if (i == Math.floor((dato[1].adicionales.length - 2) / 2) && i!=0 && dato[1].adicionales.length>4) {
            detalles += "</&­&&­&";
          }
          detalles += "N° "+(i+1)+":&"
          detalles += "*IDENTIFICADOR ⇨ "+dato[1].adicionales[i].identificador+"&*COEFICIENTE ⇨ "+dato[1].adicionales[i].coeficiente;
          detalles += "&­&";
        }
        break;

      case 12:
        detalles += "Adicional creado:&­&IDENTIFICADOR ⇨ "+dato[0].identificador+"&COEFICIENTE ⇨ "+dato[0].coeficiente+"&­&";
        detalles += "Empleado asociado:&­&NOMBRE ⇨ "+dato[1].nombre+"&LEGAJO ⇨ "+dato[1].legajo+"&SECTOR ⇨ "+dato[1].sector;
        detalles += "&OBJETIVOS ⇨ "+dato[1].objetivos+"&­&";
        if (!dato[1].adicionales) {
          dato[1].adicionales = [];
        }
        if (dato[1].adicionales.length<5) {
          detalles += "</--Adicionales del empleado:&­&"; 
        } else {
          detalles += "--Adicionales del empleado:&­&";
        }
        if (dato[1].adicionales.length==0) {
          detalles += "# No tiene adicionales. #&­&";
        }
        for (let i=0; i<dato[1].adicionales.length; i++){ 
          if (i == Math.floor((dato[1].adicionales.length - 2) / 2) && i!=0 && dato[1].adicionales.length>4) {
            detalles += "</&­&&­&";
          }
          detalles += "N° "+(i+1)+":&"
          detalles += "*IDENTIFICADOR ⇨ "+dato[1].adicionales[i].identificador+"&*COEFICIENTE ⇨ "+dato[1].adicionales[i].coeficiente;
          detalles += "&­&";
        }
        break;
      
      case 13:
        detalles += "Descuento pre-actualización:&­&PRIMER DESCUENTO ⇨ [DÍAS: "+dato[0][0].dias+" / PORCENTAJE: "+dato[0][0].descuento+"%]&";
        detalles += "PRIMER DESCUENTO INTERIOR ⇨ [DÍAS: "+dato[0][1].dias+" / PORCENTAJE: "+dato[0][1].descuento+"%]&";
        detalles += "SEGUNDO DESCUENTO ⇨ [DÍAS: "+dato[0][2].dias+" / PORCENTAJE: "+dato[0][2].descuento+"%]&";
        detalles += "TERCER DESCUENTO ⇨ [DÍAS: "+dato[0][3].dias+" / PORCENTAJE: "+dato[0][3].descuento+"]%</";

        detalles += "Descuento post-actualización:&­&PRIMER DESCUENTO ⇨ [DÍAS: "+dato[1][0].dias+" / PORCENTAJE: "+dato[1][0].descuento+"%]&";
        detalles += "PRIMER DESCUENTO INTERIOR ⇨ [DÍAS: "+dato[1][1].dias+" / PORCENTAJE: "+dato[1][1].descuento+"%]&";
        detalles += "SEGUNDO DESCUENTO ⇨ [DÍAS: "+dato[1][2].dias+" / PORCENTAJE: "+dato[1][2].descuento+"%]&";
        detalles += "TERCER DESCUENTO ⇨ [DÍAS: "+dato[1][3].dias+" / PORCENTAJE: "+dato[1][3].descuento+"%]";
        break;
      
      case 14:
        detalles += "Generación de objetivos del mes "+dato[0]+" del año "+dato[1]+":&­&";
        //OBJETIVOS NORMALES
        detalles += "--Objetivos: ";
        if (!dato[2]) {
          dato[2] = [];
          detalles += "&­&# No tiene objetivos normales. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[2].length; i++){
          if (i == Math.ceil(dato[2].length/2)) {
            detalles += "</&­&&­&&­&&­&&­&";
          }
          detalles += "N° "+(i+1)+":&"
          detalles += "*VENDEDOR ⇨ "+dato[2][i].vendedor+"&";
          detalles += "*CANAL ⇨ "+dato[2][i].canal+"&";
          detalles += "*KG_OBJ ⇨ "+dato[2][i].kgobj+"&";
          detalles += "*KG ⇨ "+dato[2][i].kg+"&";
          detalles += "*VENTAS_OBJ ⇨ "+dato[2][i].ventasobj+"&";
          detalles += "*VENTAS ⇨ "+dato[2][i].ventas+"&";
          detalles += "*CANT_OBJ ⇨ "+dato[2][i].cantobj+"&";
          detalles += "*CANT ⇨ "+dato[2][i].cant+"&";
          detalles += "&­&";
        }
        //OBJETIVOS ESPECIALES
        detalles += "</&­&&­&&­&";
        detalles += "--Objetivos Especiales: ";
        if (!dato[3]) {
          dato[3] = [];
          detalles += "&­&# No tiene objetivos especiales. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[3].length; i++){
          detalles += "N° "+(i+1)+":&"
          detalles += "*VENDEDOR ⇨ "+dato[3][i].vendedor+"&";
          detalles += "*PREMIO ⇨ "+dato[3][i].premio+"&";
          detalles += "&­&";
        }
        //OBJETIVOS CLIENTES
        detalles += "--Objetivos Clientes: ";
        if (!dato[4]) {
          dato[4] = [];
          detalles += "&­&# No tiene objetivos clientes. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[4].length; i++){
          detalles += "N° "+(i+1)+":&"
          detalles += "*KG_OBJ ⇨ "+dato[4][i].kgobj+"&";
          detalles += "*KG ⇨ "+dato[4][i].kg+"&";
          detalles += "*VENTAS_OBJ ⇨ "+dato[4][i].ventasobj+"&";
          detalles += "*VENTAS ⇨ "+dato[4][i].ventas+"&";
          detalles += "*CANT_OBJ ⇨ "+dato[4][i].cantobj+"&";
          detalles += "*CANT ⇨ "+dato[4][i].cant+"&";
          detalles += "&­&";
        }
        break;

      case 15:
        detalles += "Carga de XML para objetivos con día "+dato[0]+":&­&";
        //OBJETIVOS NORMALES
        detalles += "--Objetivos: ";
        if (!dato[4]) {
          dato[4] = [];
          detalles += "&­&# No tiene objetivos normales. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[4].length; i++){
          if (i == Math.ceil(dato[4].length*3/5)) {
            detalles += "</&­&&­&&­&&­&&­&";
          }
          detalles += "N° "+(i+1)+":&"
          detalles += "*VENDEDOR ⇨ "+dato[4][i].vendedor+"&";
          detalles += "*CANAL ⇨ "+dato[4][i].canal+"&";
          detalles += "*KG_OBJ ⇨ "+dato[4][i].kgobj+"&";
          detalles += "*KG ⇨ "+dato[4][i].kg+"&";
          detalles += "*VENTAS_OBJ ⇨ "+dato[4][i].ventasobj+"&";
          detalles += "*VENTAS ⇨ "+dato[4][i].ventas+"&";
          detalles += "*CANT_OBJ ⇨ "+dato[4][i].cantobj+"&";
          detalles += "*CANT ⇨ "+dato[4][i].cant+"&";
          detalles += "&­&";
        }
        //OBJETIVOS ESPECIALES
        detalles += "--Objetivos Especiales: ";
        if (!dato[5]) {
          dato[5] = [];
          detalles += "&­&# No tiene objetivos especiales. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[5].length; i++){
          detalles += "N° "+(i+1)+":&"
          detalles += "*VENDEDOR ⇨ "+dato[5][i].vendedor+"&";
          detalles += "*PREMIO ⇨ "+dato[5][i].premio+"&";
          detalles += "&­&";
        }
        //OBJETIVOS CLIENTES
        detalles += "--Objetivos Clientes: ";
        if (!dato[6]) {
          dato[6] = [];
          detalles += "&­&# No tiene objetivos clientes. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[6].length; i++){
          detalles += "N° "+(i+1)+":&"
          detalles += "*KG_OBJ ⇨ "+dato[6][i].kgobj+"&";
          detalles += "*KG ⇨ "+dato[6][i].kg+"&";
          detalles += "*VENTAS_OBJ ⇨ "+dato[6][i].ventasobj+"&";
          detalles += "*VENTAS ⇨ "+dato[6][i].ventas+"&";
          detalles += "*CANT_OBJ ⇨ "+dato[6][i].cantobj+"&";
          detalles += "*CANT ⇨ "+dato[6][i].cant+"&";
          detalles += "&­&";
        }

        detalles += "Objetivos pre-generación XML:&­&";
        //OBJETIVOS NORMALES
        detalles += "--Objetivos: ";
        if (!dato[2]) {
          dato[2] = [];
          detalles += "&­&# No tiene objetivos normales. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[2].length; i++){
          if (i == Math.ceil(dato[4].length*3/5)) {
            detalles += "</&­&&­&&­&&­&&­&";
          }
          detalles += "N° "+(i+1)+":&"
          detalles += "*VENDEDOR ⇨ "+dato[2][i].vendedor+"&";
          detalles += "*CANAL ⇨ "+dato[2][i].canal+"&";
          detalles += "*KG_OBJ ⇨ "+dato[2][i].kgobj+"&";
          detalles += "*KG ⇨ "+dato[2][i].kg+"&";
          detalles += "*VENTAS_OBJ ⇨ "+dato[2][i].ventasobj+"&";
          detalles += "*VENTAS ⇨ "+dato[2][i].ventas+"&";
          detalles += "*CANT_OBJ ⇨ "+dato[2][i].cantobj+"&";
          detalles += "*CANT ⇨ "+dato[2][i].cant+"&";
          detalles += "&­&";
        }
        //OBJETIVOS ESPECIALES
        detalles += "</&­&&­&&­&";
        detalles += "--Objetivos Especiales: ";
        if (!dato[3]) {
          dato[3] = [];
          detalles += "&­&# No tiene objetivos especiales. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[3].length; i++){
          detalles += "N° "+(i+1)+":&"
          detalles += "*VENDEDOR ⇨ "+dato[3][i].vendedor+"&";
          detalles += "*PREMIO ⇨ "+dato[3][i].premio+"&";
          detalles += "&­&";
        }
        //OBJETIVOS CLIENTES
        detalles += "--Objetivos Clientes: ";
        if (!dato[4]) {
          dato[4] = [];
          detalles += "&­&# No tiene objetivos clientes. #&­&";
        } else {
          detalles += "&­&";
        }
        for (let i=0; i<dato[4].length; i++){
          detalles += "N° "+(i+1)+":&"
          detalles += "*KG_OBJ ⇨ "+dato[4][i].kgobj+"&";
          detalles += "*KG ⇨ "+dato[4][i].kg+"&";
          detalles += "*VENTAS_OBJ ⇨ "+dato[4][i].ventasobj+"&";
          detalles += "*VENTAS ⇨ "+dato[4][i].ventas+"&";
          detalles += "*CANT_OBJ ⇨ "+dato[4][i].cantobj+"&";
          detalles += "*CANT ⇨ "+dato[4][i].cant+"&";
          detalles += "&­&";
        }
        break;

      case 16:
        detalles += "Carga de objetivos trimestrales para el trimestre ";
        detalles += dato[4][0]+"-"+dato[4][1]+"-"+dato[4][2];
        detalles += " del año "+dato[5]+" para el empleado "+dato[3]+".&";
        detalles += "CANTIDAD MODAL ⇨ "+dato[0]+" --- ";
        detalles += "KG MODAL ⇨ "+dato[1]+" --- ";
        detalles += "VENTAS MODAL ⇨ "+dato[2];
        break;

      case 17:
        detalles += "Liquidación no preexistente creada para el mes "+dato[0]+" del año "+dato[1]+".&";
        detalles += "Empleados incluidos:&­&[";
        for (let i=0; i<dato[2].length; i++){
          if (i!=dato[2].length-1) {
            detalles += dato[2][i].nombre+", ";
          } else {
            detalles += dato[2][i].nombre+".";
          }
        }
        detalles += "]";
        break;

      case 18:
        detalles += "Actualización de liquidación para el mes "+dato[0]+" del año "+dato[1]+":&­&";
        detalles += "LIQUIDACIÓN NUEVA&­&";
        for (let i=0; i<dato[2].length; i++){
          if (dato[4]) {
            if (i==Math.floor(dato[2].length/2)) {
              detalles += "</&­&&­&&­&&­&&­&";
            }
          } else {
            if (i%Math.ceil(dato[2].length/4)==0 && i!=0) {
              detalles += "</&­&&­&&­&&­&&­&";
            }
          }
          detalles += "Empleado N° "+(i+1)+":&";
          detalles += "*NOMBRE: "+dato[2][i].nombre+"&";
          detalles += "*SECTOR: "+dato[2][i].sector+"&";
          detalles += "*SUELDO: $"+dato[2][i].sueldo+"&";
          detalles += "*TOTAL: $"+dato[2][i].total+"&­&";
        }
        if (dato[4]) {
          detalles += "</&­&&­&&­&LIQUIDACIÓN PREVIA&­&";
        } else{
          detalles += "LIQUIDACIÓN PREVIA&­&";
        }
        if (dato[4]) {
          for (let i=0; i<dato[3].length; i++){
            if (i==Math.ceil(dato[3].length/2)) {
              detalles += "</&­&&­&&­&&­&&­&";
            }
            detalles += "Empleado N° "+(i+1)+":&";
            detalles += "*NOMBRE: "+dato[3][i].nombre+"&";
            detalles += "*SECTOR: "+dato[3][i].sector+"&";
            detalles += "*SUELDO: $"+dato[3][i].sueldo+"&";
            detalles += "*TOTAL: $"+dato[3][i].total+"&­&";
          }
        } else {
          detalles += "# No hay datos previos a la modificación. #";
        }
        break;
    }
    return detalles;
  }

  generarFecha() {
    var fecha = new Date();
    return (fecha.getFullYear().toString()+"/"
    +('0' + (fecha.getMonth() + 1)).slice(-2).toString()+"/"
    +('0' + fecha.getDate()).slice(-2).toString()+"/"
    +('0' + fecha.getHours()).slice(-2).toString()+"/"
    +('0' + fecha.getMinutes()).slice(-2).toString()+"/"
    +('0' + fecha.getSeconds()).slice(-2).toString());
  }
}


