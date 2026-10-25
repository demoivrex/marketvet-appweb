import { Adicional } from "./adicionales.model";
export interface Empleado {
    nombre:string,
    legajo:string,
    sector:string,
    objetivos:boolean,
    adicionales:Adicional[],
}

export class Empleados {
    empleados:Empleado[];

    getEmpleados():Empleado[] {
        return this.empleados;
    }

    addEmpleado(data:Empleado) {
        this.empleados.push(data);
    }
}

