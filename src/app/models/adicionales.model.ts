export class Adicional {
  identificador:string;
  coeficiente:number|undefined;

  constructor(titulo: string, coeficiente: number) {
      this.identificador = titulo;
      this.coeficiente = coeficiente;
    }
}