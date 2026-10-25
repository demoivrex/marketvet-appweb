import { LogService } from 'src/app/services/log.service';
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { LiquidacionService } from 'src/app/services/liquidacion.service';
import { Empleado } from 'src/app/models/empleado.model';
import Swal from 'sweetalert2';
import { Adicional } from 'src/app/models/adicionales.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-empleados-adicionales',
  templateUrl: './empleados-adicionales.component.html',
  styleUrls: ['./empleados-adicionales.component.css']
})

export class EmpleadosAdicionalesComponent implements OnInit {

  empleados: Empleado[] = [];
  nombreEmpleadoSeleccionado: string = "";
  adicionales: Adicional[] = [];
  nuevoAdicional: Adicional = { identificador: "", coeficiente: undefined };
  indexEmpleadoSeleccionado: number | undefined = undefined;
  indexAdicionalEditar: number | undefined = undefined;
  modoModificar: boolean = false;
  btnDisabled: boolean = true; //inicializarlo en true
  anotherBtnDisabled: boolean = true;
  anioActual: string;
  mesActual: string;
  seccionURL: string = this.router.url.slice(1);

  constructor(private router: Router, private LOG: LogService,
    private fb: FirebaseService, private liqService: LiquidacionService) {
    const fechaActual = new Date();
    this.mesActual = ('0' + (fechaActual.getMonth() + 1)).slice(-2);
    this.anioActual = fechaActual.getFullYear().toString();
  }


  ///importante que los coeficientes están en decimales 0.0algo


  ngOnInit(): void {
    this.iniciarEmpleados();
  }

  iniciarEmpleados(): void {
    this.fb.getEmpleados().subscribe((resp: any) => {
      this.empleados = resp;
    });
  }

  buscarEmpleado(nombre: string): number {
    let indice = 0;
    for (let i = 0; i < this.empleados.length; i++) {
      if (!(this.empleados[i].adicionales)) {
        this.empleados[i].adicionales = [];
      }
      if (this.empleados[i].nombre == nombre) {
        indice = i;
      }
    }
    return indice;
  }

  cargarAdicionales(): void {
    this.indexEmpleadoSeleccionado = this.buscarEmpleado(this.nombreEmpleadoSeleccionado);
    let lista = [];
    for (let i = 0; i < this.empleados[this.indexEmpleadoSeleccionado].adicionales.length; i++) {
      lista.push(this.empleados[this.indexEmpleadoSeleccionado].adicionales[i]);
    }
    this.adicionales = lista;
    this.fb.saveEmpleados(this.empleados).subscribe();
    this.enableAnotherButton();
  }

  agregarAdicional(): void {
    if (!this.modoModificar) {
      this.nuevoAdicional.coeficiente *= 0.01;
      let auxAdicional = this.nuevoAdicional;
      this.nuevoAdicional = { identificador: "", coeficiente: undefined };
      this.empleados[this.indexEmpleadoSeleccionado].adicionales.push(auxAdicional);
      this.cargarAdicionales();
      this.fb.saveEmpleados(this.empleados).subscribe((resp) => {
        this.liqService.actualizarEmpleadosLiquidacion(this.anioActual, this.mesActual, this.empleados[this.indexEmpleadoSeleccionado]);
      });
    }
  }

  eliminarAdicional(indice: number): void {
    Swal.fire({
      title: '¿Desea eliminar el Adicional?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        const index = this.empleados[this.indexEmpleadoSeleccionado].adicionales.indexOf(this.empleados[this.indexEmpleadoSeleccionado].adicionales[indice], 0);
        if (index > -1) {
          this.empleados[this.indexEmpleadoSeleccionado].adicionales.splice(index, 1);
        }
        if (!this.empleados[this.indexEmpleadoSeleccionado].adicionales) {
          this.empleados[this.indexEmpleadoSeleccionado].adicionales = [];
        }
        if (indice == this.indexAdicionalEditar) {
          this.cancelarEdit();
        }
        this.cargarAdicionales();
        Swal.fire('El adicional fue eliminado correctamente.', '', 'success');
      }
    })
  }

  modificarAdicional(indice: number): void {
    this.indexAdicionalEditar = indice;
    this.modoModificar = true;
    this.nuevoAdicional.identificador = this.adicionales[this.indexAdicionalEditar].identificador;
    this.nuevoAdicional.coeficiente = this.adicionales[this.indexAdicionalEditar].coeficiente;
    this.nuevoAdicional.coeficiente *= 100;
  }

  cancelarEdit(): void {
    this.indexAdicionalEditar = undefined;
    this.modoModificar = false;
    this.nuevoAdicional = { identificador: "", coeficiente: undefined };
  }

  actualizarAdicional(): void {
    this.nuevoAdicional.coeficiente *= 0.01;
    this.empleados[this.indexEmpleadoSeleccionado].adicionales[this.indexAdicionalEditar] = this.nuevoAdicional;
    this.cargarAdicionales();
    this.cancelarEdit();
    this.fb.saveEmpleados(this.empleados).subscribe((resp) => {
      this.liqService.actualizarEmpleadosLiquidacion(this.anioActual, this.mesActual, this.empleados[this.indexEmpleadoSeleccionado]);
    });
  }

  enableButton(): void {
    this.btnDisabled = false;
  }
  enableAnotherButton(): void {
    this.anotherBtnDisabled = false;
  }

}

