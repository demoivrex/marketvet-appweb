import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Empleado } from '../models/empleado.model';
import { Liquidacion } from '../models/liquidacion.model';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  urlBase: string = "https://recibosaf-c64ad.firebaseio.com/"
  /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  /* URL NUEVA ESTRUCTURA
  /* >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> */
  //urlnuevo:string = "https://recibosaf-c64ad.firebaseio.com/nuevo/"

  constructor(private http: HttpClient) { }

  cargarRecibos() {
    return this.http.get(`${this.urlBase}recibo.json`).pipe(
      map(this.crearArreglo)
    );
  }

  cargarRecibosArchivados() {
    return this.http.get(`${this.urlBase}recibosArchivados.json`).pipe(
      map(this.crearArreglo)
    );
  }

  private crearArreglo(recibosObj: object) {
    const recibos: any[] = [];
    if (recibosObj === null) return recibos;
    Object.keys(recibosObj).forEach(key => {
      const recibo: any = recibosObj[key];
      recibo.id = key;
      recibos.push(recibo)
    })
    return recibos;
  }

  /* CARGA DE RECIBO EN JSON */
  reciboTest = {
    "aprobado": false,
    "cheque": 0,
    "cliente": {
      "_links": {
        "self": {
          "href": "http://181.29.189.96:9002/clientes/1921"
        }
      },
      "cliId": 1921,
      "codigo": "08594",
      "condiciones_venta": [
        {
          "_links": {
            "self": {
              "href": "http://181.29.189.96:9002/clientes/1921/cond_ventas/1"
            }
          },
          "id_cond": 1,
          "por_defecto": "N",
          "porc_finan": 0
        },
        {
          "_links": {
            "self": {
              "href": "http://181.29.189.96:9002/clientes/1921/cond_ventas/2"
            }
          },
          "id_cond": 2,
          "por_defecto": "N",
          "porc_finan": 0
        }
      ],
      "crediticio": "N",
      "cuentacorrentista": "S",
      "cuit": "20411540139",
      "doc_nro": "41154013",
      "doc_tipo": {
        "descripcion": "Doc. Nac. de Identidad",
        "id_tipo": 7,
        "nombre": "DNI"
      },
      "domicilios": [
        {
          "_links": {
            "self": {
              "href": "http://181.29.189.96:9002/clientes/1921/domicilios/2816"
            }
          },
          "clasificacion": "DF",
          "dom_completo": "ISRAEL HOFFMAN 2409",
          "dom_id": 2816,
          "domicilio": "ISRAEL HOFFMAN 2409",
          "latitud": "-31.7489132",
          "localidad": {
            "_links": {
              "self": {
                "href": "http://181.29.189.96:9002/localidades/1"
              }
            },
            "cod_postal": 3100,
            "loc_id": 1,
            "nombre": "PARANA",
            "provincia": {
              "_links": {
                "self": {
                  "href": "http://181.29.189.96:9002/provincias/E"
                }
              },
              "nombre": "ENTRE RIOS",
              "prov_id": "E"
            }
          },
          "longitud": "-60.489413",
          "por_defecto": "S"
        }
      ],
      "empleados": [
        {
          "_links": {
            "self": {
              "href": "http://181.29.189.96:9002/vendedor/11"
            }
          },
          "clasif": [
            "VENDEDOR",
            "COBRADOR"
          ],
          "cuit": "20265643281",
          "emails": [
            {
              "clasificacion": {
                "id": "CO",
                "nombre": "Comercial"
              },
              "email": {
                "email": "jacobgerman2003@yahoo.com.ar",
                "id": 357
              },
              "id": 396,
              "porDefecto": "S"
            }
          ],
          "empl_id": 11,
          "fecha_nacimiento": "1978-06-20",
          "razon_social": "JACOB GERMAN"
        }
      ],
      "es_activo": true,
      "es_generico": false,
      "limite_credito": 0,
      "listas_precios": [
        {
          "_links": {
            "self": {
              "href": "http://181.29.189.96:9002/clientes/1921/listas/0"
            }
          },
          "lista_precio": {
            "_links": {
              "self": {
                "href": "http://181.29.189.96:9002/listasprecios/0"
              }
            },
            "activa": true,
            "clasificacion": 1,
            "decimales": 4,
            "listaId": 0,
            "nombre": "LISTA BASE"
          },
          "orden": 1
        }
      ],
      "nombreFantasia": "LUQUEZ HORACIO/ POLIRRUBRO",
      "razonSocial": "LUQUEZ  RIFFEL HORACIO JOAQUIN",
      "sit_ante_iva": "MO",
      "sit_ante_iva_nombre": "Monotributista",
      "telefonos": [
        {
          "clasif": "Comercial",
          "clasif_id": "COM",
          "numero": "+543434500406",
          "por_defecto": "S",
          "tel_id": 3156
        }
      ]
    },
    "colorRecibo": true,
    "comentario": "",
    "condicionVentaId": 0,
    "deposito": 43906,
    "depositos": [
      {
        "banco": "MercadoPago",
        "importeBanco": 43906
      }
    ],
    "descuento": 0,
    "efectivo": 0,
    "facturas": [
      {
        "clasificacion": "Comprobante estándar",
        "cliente": {
          "_links": {
            "self": {
              "href": "http://181.29.189.96:9002/clientes/1921"
            }
          },
          "cliId": 1921,
          "es_activo": false
        },
        "cond_vta": "Cliente 10.81",
        "cprId": 588608,
        "cpr_est_id": 1,
        "cpr_etc_id": 5,
        "cpr_tipo_id": "RC",
        "cuit": "20411540139",
        "disc_imp": false,
        "domicilio": "ISRAEL HOFFMAN 2409",
        "estado": "EMITIDA/O",
        "fecha_emision": "2023-04-19",
        "letra": "X",
        "localidad": "PARANA",
        "moneda": {
          "id": 1,
          "nombre": "PESO",
          "pais": {
            "id": 1,
            "nacionalidad": "ARGENTINO/A",
            "nombre": "ARGENTINA"
          },
          "simbolo": "$"
        },
        "monto": 14300,
        "nro": 2561,
        "nroCpr": 1465,
        "pagar": true,
        "porc_finan": 10.81,
        "razon_social": "LUQUEZ  RIFFEL HORACIO JOAQUIN",
        "rz_vendedor": "JACOB GERMAN",
        "saldo": 79.38,
        "tipo": "Recibo",
        "tipoPago": "Cta. Cte."
      }
    ],
    "fecha": "2023-05-30T10:42:08.682Z",
    "geolocalizacion": "-31.7676146,-60.5218679",
    "idCliente": 1921,
    "rendido": false,
    "subtotal": 0,
    "total": 43906,
    "vendedor": "GJ",
    "id": "-NWgF4D82OtDLXGMdmOH"
  }

  getLogs() {
    return this.http.get(`${this.urlBase}nuevo/log.json`);
  }

  getSpecificLog(id) {
    return this.http.get(`${this.urlBase}nuevo/log/${id}.json`);
  }

  putSpecificLog(LOG, id) {
    return this.http.put(`${this.urlBase}nuevo/log/${id}.json`, LOG);
  }

  cargarReciboManual() {
    return this.http.put(`${this.urlBase}recibo/${this.reciboTest.id}.json`, this.reciboTest);
  }

  actualizarRecibo(recibo) {
    return this.http.put(`${this.urlBase}recibo/${recibo.id}.json`, recibo);
  }

  cargarRecibo(idRecibo) {
    return this.http.get(`${this.urlBase}recibo/${idRecibo}.json`);
  }

  eliminarRecibo(idRecibo) {
    return this.http.delete(`${this.urlBase}recibo/${idRecibo}.json`);
  }

  eliminarReciboArchivado(idRecibo) {
    return this.http.delete(`${this.urlBase}recibosArchivados/${idRecibo}.json`);
  }

  archivarRecibo(recibo: any) {
    return this.http.put(`${this.urlBase}recibosArchivados/${recibo.id}.json`, recibo).pipe(
      map(() => {
        return this.eliminarRecibo(recibo.id).subscribe();
      })
    );
  }

  /* >>> DESCUENTOS */
  cargarDescuentos() {
    return this.http.get(`${this.urlBase}descuentos.json`);
  }

  actualizarDescuentos(descuentos) {
    return this.http.put(`${this.urlBase}descuentos.json`, descuentos);
  }

  /* >>> OBJETIVOS */
  cargarObjetivos(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}objetivos/${ano}/${mes}.json`);
  }

  actualizarObjetivos(objetivos: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}objetivos/${ano}/${mes}.json`, objetivos);
  }

  /* >>> GRAFICAS OBJETIVOS */
  cargarDatosGraficas(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}objetivos/graficas/${ano}/${mes}.json`);
  }

  actualizarDatosGraficas(datos: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}objetivos/graficas/${ano}/${mes}.json`, datos);
  }

  /* >>> OBJETIVOS ESPECIALES */
  cargarObjetivosEspeciales(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}objesp/${ano}/${mes}.json`);
  }

  actualizarObjetivosEspeciales(objetivos: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}objesp/${ano}/${mes}.json`, objetivos);
  }

  /* >>> OBJETIVOS CLIENTES */
  cargarObjetivosClientes(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}objclientes/${ano}/${mes}.json`);
  }

  actualizarObjetivosClientes(objetivos: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}objclientes/${ano}/${mes}.json`, objetivos);
  }

  /* >>> COMISIONES */
  guardarComision(comisiones: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}comision/${ano}/${mes}.json`, comisiones);
  }

  cargarComisiones(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}comision/${ano}/${mes}.json`);
  }

  ////* >>> LIQUIDACIONES *////
  /* >>> VENDEDORES */
  cargarLiquidacion(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}liquidacion/${ano}/${mes}.json`);
  }

  actualizarLiquidacion(liquidacion: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}liquidacion/${ano}/${mes}.json`, liquidacion);
  }

  /* >>> ADMINISTRACION */
  cargarLiquidacionAdm(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}liquidacion/administracion/${ano}/${mes}.json`);
  }

  actualizarLiquidacionAdm(liquidacion: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}liquidacion/administracion/${ano}/${mes}.json`, liquidacion);
  }

  /* >>> LOGISTICA */
  cargarLiquidacionLogistica(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}liquidacion/logistica/${ano}/${mes}.json`);
  }

  actualizarLiquidacionLogistica(liquidacion: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}liquidacion/logistica/${ano}/${mes}.json`, liquidacion);
  }

  /* >>> DEPOSITO */
  cargarLiquidacionDeposito(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}liquidacion/deposito/${ano}/${mes}.json`);
  }

  actualizarLiquidacionDeposito(liquidacion: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}liquidacion/deposito/${ano}/${mes}.json`, liquidacion);
  }

  /* >>> SUMATORIAS */
  cargarSumatorias(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}objetivos/sumatoria/${ano}/${mes}.json`);
  }

  actualizarSumatorias(sumatorias: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}objetivos/sumatoria/${ano}/${mes}.json`, sumatorias);
  }

  actualizarSumatoriaDiario(sumatoria: any, mes: string, ano: string, dia) {
    return this.http.put(`${this.urlBase}objetivos/sumatoria/${ano}/${mes}/${dia}.json`, sumatoria);
  }

  /* >>> DATOS CONFIGURACION */

  actualizarDatosPuntosVenta(datos) {
    return this.http.put(`${this.urlBase}config/puntosventa.json`, datos);
  }

  cargarDatosBancos() {
    return this.http.get(`${this.urlBase}config/bancos.json`);
  }

  actualizarDatosBancos(datos) {
    return this.http.put(`${this.urlBase}config/bancos.json`, datos);
  }

  getDatosCondicionVenta() {
    return this.http.get(`${this.urlBase}config/condicionventa.json`);
  }

  /* >>>>>> SECTORES */

  //Metodo para actualizar el arreglo de sectores cuando se agrega algun nuevo sector a la empresa.
  //1. agregar sector al arreglo de sectores
  //2. ejecutar la función guardarSectores desde cualquier componente
  saveSectores() {
    const sectores = ["ADMINISTRACION", "LOGISTICA", "DEPOSITO", "CANAL TRADICIONAL", "CANAL DISTRIBUIDOR", "CANAL DIGITAL"]
    return this.http.put(`${this.urlBase}nuevo/sectores.json`, sectores);
  }

  getSectores() {
    return this.http.get(`${this.urlBase}nuevo/sectores.json`);
  }



  /* >>>>>> EMPLEADOS */
  saveEmpleados(empleados: Empleado[]) {
    return this.http.put(`${this.urlBase}nuevo/empleados.json`, empleados);
  }

  getEmpleados() {
    return this.http.get(`${this.urlBase}nuevo/empleados.json`);
  }

  deleteEmpleado(idEmpleado: number) {
    return this.http.delete(`${this.urlBase}nuevo/empleados/${idEmpleado}.json`);
  }

  /* >>>>>> LIQUIDACIÓN */
  saveLiquidacion(liquidaciones: Liquidacion[], ano: string, mes: string) {
    return this.http.put(`${this.urlBase}nuevo/liquidacion/${ano}/${mes}.json`, liquidaciones);
  }

  getLiquidacion(ano: string, mes: string) {
    return this.http.get(`${this.urlBase}nuevo/liquidacion/${ano}/${mes}.json`);
  }

  /* >>>>>> VENDEDORES */
  getVendedores() {
    return this.http.get(`${this.urlBase}config/vendedores.json`);
  }

  /* >>>>>> REGISTROS */
  cargarRegistroRecibo(mes: string, ano: string, recibos: any) {
    return this.http.post(`${this.urlBase}registros/recibos/${ano}/${mes}.json`, recibos);
  }

  /* >>>>>> OBJETIVOS NUEVOS */
  getObjetivos(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}nuevo/objetivos/${ano}/${mes}.json`);
  }

  updateObjetivos(objetivos: any, mes: string, ano: string) {
    return this.http.put(`${this.urlBase}nuevo/objetivos/${ano}/${mes}.json`, objetivos);
  }

  // KILOS VITAL
  getKilosVital(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}nuevo/kilosvital/${ano}/${mes}.json`);
  }

  updateKilosVital(mes: string, ano: string, kilos: any) {
    return this.http.put(`${this.urlBase}nuevo/kilosvital/${ano}/${mes}.json`, kilos);
  }

  // RENTABILIDAD
  getRentabilidadDatos(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}nuevo/rentabilidad/datos/${ano}/${mes}.json`);
  }

  getRentabilidadVendedores(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}nuevo/rentabilidad/datos/${ano}/${mes}/vendedores.json`);
  }

  updateRentabilidadDatos(mes: string, ano: string, datos: any) {
    return this.http.put(`${this.urlBase}nuevo/rentabilidad/datos/${ano}/${mes}.json`, datos);
  }

  getRentabilidadDescuentos(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}nuevo/rentabilidad/descuentos/${ano}/${mes}.json`);
  }

  updateRentabilidadDescuentos(mes: string, ano: string, descuentos: any) {
    return this.http.put(`${this.urlBase}nuevo/rentabilidad/descuentos/${ano}/${mes}.json`, descuentos);
  }

  // CUENTA CORRIENTE
  getCuentaCorriente(mes: string, ano: string) {
    return this.http.get(`${this.urlBase}nuevo/cuentacorriente/${ano}/${mes}.json`);
  }

  updateCuentaCorriente(mes: string, ano: string, datos: any) {
    return this.http.put(`${this.urlBase}nuevo/cuentacorriente/${ano}/${mes}.json`, datos);
  }

  // ROLES DE USUARIO
  getUsuarioRol(uid: string) {
    return this.http.get(`${this.urlBase}usuarios/${uid}/role.json`);
  }

  updateUsuarioRol(uid: string, role: string) {
    return this.http.put(`${this.urlBase}usuarios/${uid}/role.json`, JSON.stringify(role));
  }
}