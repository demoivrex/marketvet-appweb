import { Adicional } from './adicionales.model';
import { Premios } from './premios.model';
export class Liquidacion {
  nombre: string;
  sector: string;
  sueldo: number;
  aguinaldo: number;
  viaticos: number;
  adelantos: number;
  gastos: number;
  premios: number;
  totalkm: number;
  precioKm: number;
  tienePremios: boolean;
  adicionalPorKM: number;
  agregadosBasicos: Adicional[];
  premiosObjetivos: Premios[];
  cobranza: number;
  total: number;

  constructor(
    nombreEmpleado: string,
    sectorEmpleado: string,
    poseePremios: boolean,
    adicionalesEmpleado: Adicional[]
  ) {
    this.nombre = nombreEmpleado;
    this.sector = sectorEmpleado;
    this.sueldo = 0;
    this.aguinaldo = 0;
    this.viaticos = 0;
    this.adelantos = 0;
    this.gastos = 0;
    this.premios = 0;
    this.totalkm = 0;
    this.precioKm = 0;
    this.tienePremios = poseePremios;
    this.adicionalPorKM = 0;
    this.agregadosBasicos = adicionalesEmpleado;
    this.premiosObjetivos = [];
    this.cobranza = 0;
    this.total = 0;
  }
}
