import { Injectable } from '@angular/core';
import { Liquidacion } from '../models/liquidacion.model';
import { Premios } from '../models/premios.model';

@Injectable({
  providedIn: 'root',
})
export class PremiosService {
  calcularPremios(
    liquidacion: Liquidacion[],
    objetivos,
    rentabilidad,
    diasCalle,
  ): Liquidacion[] {

    let totalCobradoTrad: number = this.calcularCobrado(
      liquidacion,
      'CANAL TRADICIONAL'
    );

    let coefTrad: number = this.calcularCoeficiente(objetivos, 'tradicional');
    let coefDist: number = this.calcularCoeficiente(objetivos, 'distribuidores');
    let coefDig: number = this.calcularCoeficiente(objetivos, 'digital');

    let totalVentasTrad: number = this.calcularVentas(objetivos, 'tradicional');
    let totalVentasDist: number = this.calcularVentas(objetivos, 'distribuidores');
    let totalVentasDigital: number = this.calcularVentasDigital(objetivos, 'digital');

    console.log('coefTrad', coefTrad);
    console.log('coefDist', coefDist);
    console.log('coefDig', coefDig);
    console.log('totalVentasTrad', totalVentasTrad);
    console.log('totalVentasDist', totalVentasDist);
    console.log('totalVentasDigital', totalVentasDigital);

    for (let i = 0; i < liquidacion.length; i++) {
      //PREMIOS ADMINISTRACION LOGISTICA Y DEPOSITO
      if (
        (liquidacion[i].sector == 'ADMINISTRACION' || liquidacion[i].sector == 'LOGISTICA' || liquidacion[i].sector == 'DEPOSITO') &&
        liquidacion[i].tienePremios == true
      ) {
        liquidacion[i] = this.calcularPremiosAdministracion(
          liquidacion[i],
          coefTrad,
          coefDist,
          coefDig,
          totalVentasTrad,
          totalVentasDist,
          totalVentasDigital
        );
      }

      //PREMIOS VENDEDORES TRADICIONAL
      if (
        liquidacion[i].sector == 'CANAL TRADICIONAL'
      ) {
        const rentabilidadVendedor = this.obtenerRentabilidadVendedor(liquidacion[i].nombre, rentabilidad);
        const objetivosVendedor = this.obtenerObjetivosVendedor(liquidacion[i].nombre, objetivos);
        const diasVendedor = this.obtenerDiasVendedor(liquidacion[i].nombre, diasCalle);

        liquidacion[i] = this.calcularPremiosVendedores(
          liquidacion[i],
          objetivosVendedor,
          rentabilidadVendedor,
          diasVendedor
        );
      }

      //PREMIOS DIGITAL
      if (liquidacion[i].sector == 'CANAL DIGITAL') {
        const rentabilidadTradicional = this.obtenerRentabilidadTradicionalVendedor(liquidacion[i].nombre, rentabilidad);
        const ventasTradicional = this.obtenerVentasTradicionalVendedor(liquidacion[i].nombre, rentabilidad)
        const ventasDistribuidor = this.obtenerVentasDistribuidorVendedor(liquidacion[i].nombre, rentabilidad)
        const rentabilidadDistribuidor = this.obtenerRentabilidadDistribuidorVendedor(liquidacion[i].nombre, rentabilidad);
        const objetivosVendedor = this.obtenerObjetivosVendedor(liquidacion[i].nombre, objetivos);
        const diasVendedor = this.obtenerDiasVendedor(liquidacion[i].nombre, diasCalle);

        liquidacion[i] = this.calcularPremiosDigital(
          liquidacion[i],
          objetivosVendedor,
          rentabilidadTradicional,
          rentabilidadDistribuidor,
          ventasTradicional,
          ventasDistribuidor,
          diasVendedor,
          coefTrad,
          coefDist
        );
      }

      if (liquidacion[i].sector == 'CANAL DISTRIBUIDOR') {
        const rentabilidadVendedor = this.obtenerRentabilidadVendedor(liquidacion[i].nombre, rentabilidad);
        const objetivosVendedor = this.obtenerObjetivosVendedor(liquidacion[i].nombre, objetivos);
        const diasVendedor = this.obtenerDiasVendedor(liquidacion[i].nombre, diasCalle);

        liquidacion[i] = this.calcularPremiosDistribuidor(
          liquidacion[i],
          objetivosVendedor,
          rentabilidadVendedor,
          diasVendedor,
          coefTrad,
          totalVentasTrad
        );
      }
    }
    return liquidacion;
  }

  private calcularCoeficiente(objetivos, canal: string) {
    let ventasCanal: number = 0;
    let objetivoCanal: number = 0;
    for (let i = 0; i < objetivos.length; i++) {
      if (objetivos[i].canal == canal) {
        ventasCanal += objetivos[i].ventas;
        objetivoCanal += objetivos[i].ventasobj;
      }
    }
    return ventasCanal / objetivoCanal;
  }

  private obtenerRentabilidadVendedor(vendedor: string, rentabilidad: any) {
    const match = rentabilidad.find((item: any) => item.vendedor === vendedor);
    if (!match) throw new Error(`Vendedor no encontrado: ${vendedor}`);
    return match.totales.rentabilidadPorcentaje;
  }

  private obtenerRentabilidadTradicionalVendedor(vendedor: string, rentabilidad: any) {
    const match = rentabilidad.find((item: any) => item.vendedor === vendedor);
    if (!match) throw new Error(`Vendedor no encontrado: ${vendedor}`);
    return match.totalesTradicional.rentabilidadPorcentaje;
  }

  private obtenerRentabilidadDistribuidorVendedor(vendedor: string, rentabilidad: any) {
    const match = rentabilidad.find((item: any) => item.vendedor === vendedor);
    if (!match) throw new Error(`Vendedor no encontrado: ${vendedor}`);
    return match.totalesDistribuidor.rentabilidadPorcentaje;
  }

  private obtenerVentasDistribuidorVendedor(vendedor: string, rentabilidad: any) {
    const match = rentabilidad.find((item: any) => item.vendedor === vendedor);
    if (!match) throw new Error(`Vendedor no encontrado: ${vendedor}`);
    return match.totalesDistribuidor.total;
  }

  private obtenerVentasTradicionalVendedor(vendedor: string, rentabilidad: any) {
    const match = rentabilidad.find((item: any) => item.vendedor === vendedor);
    if (!match) throw new Error(`Vendedor no encontrado: ${vendedor}`);
    return match.totalesTradicional.total;
  }

  private obtenerObjetivosVendedor(vendedor: string, objetivos: any) {
    const match = objetivos.find((item: any) => item.vendedor === vendedor);
    if (!match) throw new Error(`Vendedor no encontrado en objetivos: ${vendedor}`);
    return match;
  }

  private obtenerDiasVendedor(vendedor: string, diasCalle: any) {
    const match = diasCalle.find((item: any) => item.vendedor === vendedor);
    if (!match) throw new Error(`Vendedor no encontrado en días de calle: ${vendedor}`);
    return match.dias;
  }

  private calcularVentas(objetivos, canal: string): number {
    let ventasTotales: number = 0;
    for (let i = 0; i < objetivos.length; i++) {
      if (objetivos[i].canal == canal) {
        ventasTotales += objetivos[i].ventas;
      }
    }
    return ventasTotales;
  }

  private calcularVentasDigital(objetivos, canal: string): number {
    let ventasTotales: number = 0;
    for (let i = 0; i < objetivos.length; i++) {
      if (objetivos[i].canal == canal) {
        ventasTotales += objetivos[i].ventasDigital;
      }
    }
    return ventasTotales;
  }

  private calcularCobrado(liquidacion: Liquidacion[], canal: string): number {
    let totalCobrado: number = 0;
    for (let i = 0; i < liquidacion.length; i++) {
      if (liquidacion[i].sector == canal) {
        totalCobrado += liquidacion[i].cobranza;
      }
    }
    return totalCobrado;
  }

  private calcularPremiosAdministracion(
    liquidacion: Liquidacion,
    coefTrad: number,
    coefDist: number,
    coefDig: number,
    totalVentasTrad: number,
    totalVentasDist: number,
    totalVentasDigital: number
  ): Liquidacion {
    let premiosObjetivos: Premios[] = [];
    //PREMIO POR OBJETIVO DE CANAL TRADICIONAL
    const labelTrad = 'Comisión por Ventas Canal Tradicional';
    let comisionTrad: number = 0;
    if (coefTrad >= 1) {
      comisionTrad = 0.0012;
    } else if (coefTrad >= 0.9) {
      comisionTrad = 0.0006;
    }
    premiosObjetivos.push(this.calcularPremio(labelTrad, coefTrad, totalVentasTrad, comisionTrad));

    //PREMIO POR OBJETIVO DE CANAL DISTRIBUIDOR
    const labelDist = 'Comisión por Ventas Canal Distribuidor';
    let comisionDist: number = 0;
    if (coefDist >= 1) {
      comisionDist = 0.0012;
    } else if (coefDist >= 0.9) {
      comisionDist = 0.0006;
    }
    premiosObjetivos.push(this.calcularPremio(labelDist, coefDist, totalVentasDist, comisionDist));

    //PREMIO POR OBJETIVO DE CANAL DIGITAL
    const labelDig = 'Comisión por Ventas Canal Digital';
    let comisionDig: number = 0;
    if (coefDig >= 1) {
      comisionDig = 0.0012;
    } else if (coefDig >= 0.9) {
      comisionDig = 0.0006;
    }
    premiosObjetivos.push(this.calcularPremio(labelDig, coefDig, totalVentasDigital, comisionDig));

    liquidacion.premiosObjetivos = premiosObjetivos;
    const totalPremios = this.calcularTotalPremios(premiosObjetivos);
    liquidacion.total = this.sumarTotalLiquidacion(
      totalPremios,
      liquidacion.sueldo,
      liquidacion.aguinaldo,
      liquidacion.viaticos,
      liquidacion.gastos,
      liquidacion.premios
    );

    return liquidacion;
  }

  /*   calcularPremiosSectores(
      liquidacion: Liquidacion,
      coefTrad: number,
      coefDist: number
    ): Liquidacion {
      let premiosObjetivos: Premios[] = [];
  
      //PREMIO POR OBJETIVO DE VENTAS DE CANAL TRADICIONAL
      const labelTrad = 'Comisión por ventas Canal Tradicional';
      let comisionTrad: number = coefTrad >= 0.95 ? 0.25 : 0.2;
      premiosObjetivos.push(
        this.calcularPremio(labelTrad, coefTrad, liquidacion.sueldo, comisionTrad)
      );
  
      //PREMIO POR OBJETIVO DE VENTAS DE CANAL DISTRIBUIDOR
      const labelDist = 'Comisión por ventas Canal Distribuidor';
      let comisionDist: number = coefDist >= 0.95 ? 0.25 : 0.2;
      premiosObjetivos.push(
        this.calcularPremio(labelDist, coefDist, liquidacion.sueldo, comisionDist)
      );
  
      const totalPremios = this.calcularTotalPremios(premiosObjetivos);
      liquidacion.premiosObjetivos = premiosObjetivos;
  
      liquidacion.total = this.sumarTotalLiquidacion(
        totalPremios,
        liquidacion.sueldo,
        liquidacion.aguinaldo,
        liquidacion.viaticos,
        liquidacion.gastos,
        liquidacion.premios
      );
  
      return liquidacion;
    } */

  private calcularPremiosVendedores(
    liquidacion: Liquidacion,
    objetivo,
    rentabilidadVendedor,
    diasVendedor): Liquidacion {

    let premiosObjetivos: Premios[] = [];
    //OBJETIVO MONTO VENTA
    let comisionMonto: number;
    comisionMonto = this.asignarComisionObjetivoMontoVentas(objetivo.ventasp);
    const labelMonto = 'COMISIÓN POR OBJETIVO DE VENTAS';
    premiosObjetivos.push(
      this.calcularPremio(
        labelMonto,
        objetivo.ventasp,
        objetivo.ventas,
        comisionMonto
      )
    );

    //COMISION POR RENTABILIDAD
    let comisionRentabilidad: number;
    comisionRentabilidad = this.asignarComisionRetabilidad(rentabilidadVendedor);
    const labelRentabilidad = 'COMISIÓN POR RENTABILIDAD';
    premiosObjetivos.push(
      this.calcularPremio(
        labelRentabilidad,
        rentabilidadVendedor / 100,
        liquidacion.cobranza,
        comisionRentabilidad
      )
    );

    //COMISION POR DIAS
    let comisionDias: number;
    comisionDias = this.asignarComisionDias(diasVendedor);
    const labelDias = 'COMISIÓN POR CUENTA CORRIENTE';
    premiosObjetivos.push(
      this.calcularPremio(
        labelDias,
        diasVendedor,
        liquidacion.cobranza,
        comisionDias
      )
    );

    const totalPremios = this.calcularTotalPremios(premiosObjetivos);
    liquidacion.premiosObjetivos = premiosObjetivos;

    liquidacion.total = this.sumarTotalLiquidacion(
      totalPremios,
      liquidacion.sueldo,
      liquidacion.aguinaldo,
      liquidacion.viaticos,
      liquidacion.gastos,
      liquidacion.premios
    );

    return liquidacion;
  }

  private calcularPremiosDigital(
    liquidacion: Liquidacion,
    objetivo,
    rentabilidadTradicional,
    rentabilidadDistribuidor,
    ventasTradicional,
    ventasDistribuidor,
    dias,
    coefTrad: number,
    coefDist: number
  ): Liquidacion {
    let premiosObjetivos: Premios[] = [];

    //PREMIO POR OBJETIVO DE VENTAS DIGITALES
    const labelVentas = 'COMISIÓN POR VENTAS DIGITALES';
    let comisionVentasDigital: number = this.asignarComisionVentaDigital(objetivo.ventasp);
    premiosObjetivos.push(
      this.calcularPremio(
        labelVentas,
        objetivo.ventasp,
        objetivo.ventas,
        comisionVentasDigital
      )
    );

    //PREMIO POR RENTABILIDAD TRADICIONAL
    let comisionRentabilidadTradicional: number;
    comisionRentabilidadTradicional = this.asignarComisionRetabilidadDigitalTradicional(rentabilidadTradicional);
    const labelRentabilidadTrad = 'COMISIÓN POR RENTABILIDAD TRADICIONAL';
    premiosObjetivos.push(
      this.calcularPremio(
        labelRentabilidadTrad,
        rentabilidadTradicional / 100,
        ventasTradicional,
        comisionRentabilidadTradicional
      )
    );

    //PREMIO POR RENTABILIDAD DISTRIBUIDOR
    let comisionRentabilidadDist: number;
    comisionRentabilidadDist = this.asignarComisionRetabilidadDigitalDistribuidor(rentabilidadDistribuidor);
    const labelRentabilidadDist = 'COMISIÓN POR RENTABILIDAD DISTRIBUIDOR';
    premiosObjetivos.push(
      this.calcularPremio(
        labelRentabilidadDist,
        rentabilidadDistribuidor / 100,
        ventasDistribuidor,
        comisionRentabilidadDist
      )
    );

    //PREMIO POR CUENTA CORRIENTE
    const labelDias = 'COMISIÓN POR CUENTA CORRIENTE';
    let comisionDias: number = this.asignarComisionDiasDigital(dias);
    premiosObjetivos.push(
      this.calcularPremio(
        labelDias,
        dias,
        liquidacion.cobranza,
        comisionDias
      )
    );

    //PREMIO POR OBJETIVO DE VENTAS VENDEDORES TRADICIONAL
    const labelVentasVendedor = 'COMISIÓN POR VENTA A CANAL TRADICIONAL';
    let ventasCanalTradicional = objetivo.ventasDigital - objetivo.ventas;
    let comisionDigitalCanalTradicional = this.asignarComisionVentaDigital(coefTrad);
    premiosObjetivos.push(
      this.calcularPremio(
        labelVentasVendedor,
        coefTrad,
        ventasCanalTradicional,
        comisionDigitalCanalTradicional
      )
    );

    //PREMIO POR OBJETIVO DE VENTAS VENDEDORES DISTRIBUIDOR
    const labelVentasDist = 'COMISIÓN POR VENTA A CANAL DISTRIBUIDOR';
    let comisionDigitalCanalDistribuidor = this.asignarComisionVentaDigital(coefDist);
    premiosObjetivos.push(
      this.calcularPremio(
        labelVentasDist,
        coefDist,
        objetivo.ventasDistribuidor,
        comisionDigitalCanalDistribuidor
      )
    );


    liquidacion.premiosObjetivos = premiosObjetivos;
    const totalPremios = this.calcularTotalPremios(premiosObjetivos);
    liquidacion.total = this.sumarTotalLiquidacion(
      totalPremios,
      liquidacion.sueldo,
      liquidacion.aguinaldo,
      liquidacion.viaticos,
      liquidacion.gastos,
      liquidacion.premios
    );

    return liquidacion;
  }

  private calcularPremiosDistribuidor(
    liquidacion: Liquidacion,
    objetivo,
    rentabilidad,
    dias,
    coefTrad,
    totalVentasTrad: number
  ) {
    let premiosObjetivos: Premios[] = [];

    //PREMIO POR OBJETIVO DE VENTAS
    const labelVentas = 'COMISIÓN POR VENTAS';
    let comisionVentas: number = this.asignarComisionVentaDistribuidor(objetivo.ventasp);
    premiosObjetivos.push(
      this.calcularPremio(
        labelVentas,
        objetivo.ventasp,
        objetivo.ventas,
        comisionVentas
      )
    );

    //PREMIO POR RENTABILIDAD
    let comisionRentabilidad: number;
    comisionRentabilidad = this.asignarComisionRetabilidadDistribuidor(rentabilidad);
    const labelRentabilidad = 'COMISIÓN POR RENTABILIDAD';
    premiosObjetivos.push(
      this.calcularPremio(
        labelRentabilidad,
        rentabilidad / 100,
        liquidacion.cobranza,
        comisionRentabilidad
      )
    );

    if (liquidacion.nombre == "SPECTOR WALTER") {
      //PREMIO POR CUENTA CORRIENTE
      const labelDias = 'COMISIÓN POR CUENTA CORRIENTE';
      let comisionDias = dias < 60 ? 0.005 : 0.0;
      premiosObjetivos.push(
        this.calcularPremio(
          labelDias,
          dias,
          liquidacion.cobranza,
          comisionDias
        )
      );

      // PREMIO POR AYUDA VENTA TRADICIONAL
      const labelAyudaVentaTradicional = 'PREMIO POR AYUDA VENTA TRADICIONAL';
      let comisionAyudaVentaTradicional: number = this.asignarComisionVentaAyudaTradicional(coefTrad);
      premiosObjetivos.push(
        this.calcularPremio(
          labelAyudaVentaTradicional,
          coefTrad,
          totalVentasTrad,
          comisionAyudaVentaTradicional
        )
      );
    } else {
      const labelDias = 'COMISIÓN POR CUENTA CORRIENTE';
      let comisionDias: number = this.asignarComisionDiasDistribuidor(dias);
      premiosObjetivos.push(
        this.calcularPremio(
          labelDias,
          dias,
          liquidacion.cobranza,
          comisionDias
        )
      );
    }

    liquidacion.premiosObjetivos = premiosObjetivos;
    const totalPremios = this.calcularTotalPremios(premiosObjetivos);
    liquidacion.total = this.sumarTotalLiquidacion(
      totalPremios,
      liquidacion.sueldo,
      liquidacion.aguinaldo,
      liquidacion.viaticos,
      liquidacion.gastos,
      liquidacion.premios
    );

    return liquidacion;
  }

  private calcularPremio(
    label: string,
    coeficiente: number,
    valor: number,
    comision: number
  ) {
    const total = valor * comision;
    const premio: Premios = {
      label: label,
      coeficiente: coeficiente,
      montoImponible: valor,
      comision: comision,
      total: total,
    };
    return premio;
  }

  private calcularTotalPremios(premios: Premios[]): number {
    let total: number = 0;
    for (let i = 0; i < premios.length; i++) {
      total += premios[i].total;
    }
    return total;
  }

  private sumarTotalLiquidacion(
    premiosObj: number,
    sueldo: number,
    aguinaldo: number,
    viaticos: number,
    gastos: number,
    premios: number
  ): number {
    return (
      premiosObj + sueldo + aguinaldo + viaticos - viaticos + gastos + premios
    );
  }

  private asignarComisionObjetivoMontoVentas(coef: number): number {
    let comision: number = 0;
    if (coef > 1) {
      comision = 0.01;
    } else if (coef >= 0.9) {
      comision = 0.007;
    } else if (coef >= 0.8) {
      comision = 0.004;
    }
    return comision;
  }

  private asignarComisionRetabilidad(rentabilidad: number) {
    let comision: number = 0;
    if (rentabilidad > 30) {
      comision = 0.01;
    } else if (rentabilidad >= 25) {
      comision = 0.007;
    } else if (rentabilidad >= 20) {
      comision = 0.004;
    }
    return comision;
  }

  private asignarComisionRetabilidadDigitalTradicional(rentabilidad: number) {
    let comision: number = 0;
    if (rentabilidad > 30) {
      comision = 0.005;
    } else if (rentabilidad >= 25 && rentabilidad < 30) {
      comision = 0.003;
    } else if (rentabilidad >= 20 && rentabilidad < 25) {
      comision = 0.001;
    }
    return comision;
  }

  private asignarComisionRetabilidadDigitalDistribuidor(rentabilidad: number) {
    let comision: number = 0;
    if (rentabilidad > 12) {
      comision = 0.005;
    } else if (rentabilidad >= 10 && rentabilidad < 12) {
      comision = 0.003;
    } else if (rentabilidad >= 8 && rentabilidad < 10) {
      comision = 0.001;
    }
    return comision;
  }

  private asignarComisionDias(dias: number) {
    if (dias < 35) {
      return 0.0075;
    } else if (dias >= 35 && dias < 45) {
      return 0.005;
    } else if (dias >= 45 && dias < 60) {
      return 0.0025;
    } else if (dias >= 60) {
      return 0;
    }
  }

  private asignarComisionDiasDigital(dias: number) {
    if (dias < 35) {
      return 0.008;
    } else if (dias < 45) {
      return 0.005;
    } else if (dias < 60) {
      return 0.0025;
    } else if (dias >= 60) {
      return 0;
    }
  }

  private asignarComisionVentaDigital(coef: number): number {
    let comision: number = 0;
    if (coef > 1) {
      comision = 0.005;
    } else if (coef >= 0.9) {
      comision = 0.004;
    }
    return comision;
  }

  private asignarComisionVentaDistribuidor(coef: number): number {
    let comision: number = 0;
    if (coef > 1) {
      comision = 0.005;
    } else if (coef >= 0.9) {
      comision = 0.003;
    } else if (coef >= 0.8) {
      comision = 0.001;
    }
    return comision;
  }

  private asignarComisionRetabilidadDistribuidor(rentabilidad: number) {
    let comision: number = 0;
    if (rentabilidad > 12) {
      comision = 0.005;
    } else if (rentabilidad >= 10) {
      comision = 0.003;
    } else if (rentabilidad >= 8) {
      comision = 0.001;
    }
    return comision;
  }

  private asignarComisionVentaAyudaTradicional(coef: number) {
    let comision: number = 0;
    if (coef > 1) {
      comision = 0.003;
    } else if (coef >= 0.9) {
      comision = 0.002;
    }
    return comision;
  }

  private asignarComisionDiasDistribuidor(dias: number) {
    let comision: number = 0;
    if (dias < 35) {
      comision = 0.005;
    } else if (dias < 45) {
      comision = 0.003;
    } else if (dias < 60) {
      comision = 0.001;
    }
    return comision;
  }

  /* private asignarComisionEspecial(coef: number): number {
    if (coef < 0.85) {
      return 0.001;
    }
    if (coef < 0.95 && coef >= 0.85) {
      return 0.002;
    }
    if (coef >= 0.95) {
      return 0.003;
    }
  } */

  /* private asignarComisionARF(nombre: string, coef: number): number {
    if (nombre !== 'EGEA WALTER') {
      // Lógica cuando el nombre no es 'EGEA WALTER'
      if (coef < 0.85) {
        return 0.1;
      }
      if (coef < 0.95 && coef >= 0.85) {
        return 0.15;
      }
      if (coef >= 0.95) {
        return 0.2;
      }
    } else {
      // Lógica cuando el nombre es 'EGEA WALTER'
      if (coef <= 0.85) {
        return 0.025;
      } else {
        return 0.05;
      }
    }
  } */

  /* private asignarComisionARFEspecial(nombre: string, coefDist: number): number {
    if (nombre == 'CHIARDOLA IVAN') {
      //COMISION ARF PARA IVAN
      if (coefDist < 0.85) {
        return 0.01;
      }
      if (coefDist < 0.95 && coefDist >= 0.85) {
        return 0.025;
      }
      if (coefDist >= 0.95) {
        return 0.05;
      }
    } else {
      //COMISION ARF PARA WALTER
      if (coefDist < 0.85) {
        return 0.015;
      }
      if (coefDist < 0.95 && coefDist >= 0.85) {
        return 0.02;
      }
      if (coefDist >= 0.95) {
        return 0.025;
      }
    }
  } */

  /* private asignarComisionVentasTotalesCanalTradicional(coefTrad): number {
    if (coefTrad < 0.85) {
      return 0.002;
    }
    if (coefTrad < 0.95 && coefTrad >= 0.85) {
      return 0.002;
    }
    if (coefTrad >= 0.95) {
      return 0.003;
    }
  } */
}
