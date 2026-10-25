import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { LogService } from 'src/app/services/log.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-empleados',
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.css']
})
export class EmpleadosComponent implements OnInit {

  empleados: Empleado[] = [];
  sectores: string[] = [];
  nuevoEmpleado: Empleado = { legajo: "", nombre: "", sector: "", objetivos: false, adicionales: [] };
  empleadoSelec: number = 0;
  seccionURL: string = this.router.url.slice(1);
  editMode: boolean = false;
  mesActual: string;
  anioActual: string;


  constructor(private router: Router, private LOG: LogService, private fb: FirebaseService, private liqService: LiquidacionService) {
    const fechaActual = new Date();
    this.mesActual = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    this.anioActual = fechaActual.getFullYear().toString();
  }

  ngOnInit(): void {
    this.cargarSectores();
    this.cargarEmpleados();
  }

  cargarSectores() {
    this.fb.getSectores().subscribe((resp: any) => {
      this.sectores = resp;
    });
  }

  cargarEmpleados() {
    this.fb.getEmpleados().subscribe((resp: any) => {
      this.empleados = resp;
    });
  }

  agregarEmpleado() {
    if (this.editMode) {
      this.editMode = false;

      this.empleados[this.empleadoSelec].legajo = this.nuevoEmpleado.legajo;
      this.empleados[this.empleadoSelec].nombre = this.nuevoEmpleado.nombre;
      this.empleados[this.empleadoSelec].sector = this.nuevoEmpleado.sector;
      this.empleados[this.empleadoSelec].objetivos = this.nuevoEmpleado.objetivos;
      this.fb.saveEmpleados(this.empleados).subscribe((resp) => {
        this.liqService.actualizarEmpleadosLiquidacion(this.anioActual, this.mesActual, this.empleados[this.empleadoSelec]);
      });
    }
    else {
      this.empleados.push(this.nuevoEmpleado);
      this.fb.saveEmpleados(this.empleados).subscribe((resp) => {
        this.liqService.agregarEmpleadosLiquidacion(this.anioActual, this.mesActual);
      });
    }
    this.nuevoEmpleado = { legajo: "", nombre: "", sector: "", objetivos: false, adicionales: [] };
  }

  editarEmpleado(i: number) {
    this.editMode = true;
    this.empleadoSelec = i;
    this.nuevoEmpleado.legajo = this.empleados[i].legajo;
    this.nuevoEmpleado.nombre = this.empleados[i].nombre;
    this.nuevoEmpleado.sector = this.empleados[i].sector;
    this.nuevoEmpleado.objetivos = this.empleados[i].objetivos;
  }

  cancelarEdit() {
    this.editMode = false;
    this.empleadoSelec = 0;
    this.nuevoEmpleado = { legajo: "", nombre: "", sector: "", objetivos: false, adicionales: [] };
  }

  eliminarEmpleado(i: number) {
    Swal.fire({
      title: 'Desea eliminar el Empleado?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.fb.deleteEmpleado(i).subscribe();
        this.empleados.splice(i, 1);
        this.fb.saveEmpleados(this.empleados).subscribe(); //Se guardan nuevamente los empleados para actualizar los ID del arreglo en la base de datos
        this.cancelarEdit();
        Swal.fire('Eliminado!', '', 'success');
      }
    })
  }

}
