import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { FirebaseService } from '../../services/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recibos-archivados',
  templateUrl: './recibos-archivados.component.html',
  styleUrls: ['./recibos-archivados.component.css']
})
export class RecibosArchivadosComponent implements OnInit {
  recibos: any[] = [];
  listaRecibos: any[] = [];
  reciboEditar;
  verEditar: boolean = false;
  filtroSelec: string = "";
  esquemaSelec: string = "1";

  //TOTALES TABLA
  totalEfectivo: number = 0;
  totalCheques: number = 0;
  totalDepositos: number = 0;
  totalRecibos: number = 0;

  constructor(private router: Router, private fb: FirebaseService) { }

  ngOnInit(): void {
    this.actualizar();
  }

  actualizar() {
    Swal.fire({
      title: 'Espere!',
      text: 'Cargando recibos archivados...',
      icon: 'info',
    });
    Swal.showLoading();
    this.fb.cargarRecibosArchivados().subscribe((resp) => {
      this.recibos = resp;
      this.listaRecibos = resp;
      this.verEditar = false;
      this.calcularTotalesTabla();
      Swal.close();
    });
  }

  filtrar(vendedor: string) {
    this.filtroSelec = vendedor;
    let filtrados = vendedor
      ? this.listaRecibos.filter(r => r.vendedor === vendedor)
      : [...this.listaRecibos];

    if (this.esquemaSelec !== '1') {
      const esEsquema2 = this.esquemaSelec === 'true';
      filtrados = filtrados.filter(r => r.colorRecibo === esEsquema2);
    }

    this.recibos = filtrados;
    this.calcularTotalesTabla();
  }

  noFiltrar() {
    this.filtroSelec = "";
    let filtrados = [...this.listaRecibos];

    if (this.esquemaSelec !== '1') {
      const esEsquema2 = this.esquemaSelec === 'true';
      filtrados = filtrados.filter(r => r.colorRecibo === esEsquema2);
    }

    this.recibos = filtrados;
    this.calcularTotalesTabla();
  }

  private calcularTotalesTabla() {
    this.blanquearTotalesTabla();
    if (this.recibos) {
      this.totalEfectivo = this.recibos.reduce((acc, recibo) => acc + recibo.efectivo, 0);
      this.totalCheques = this.recibos.reduce((acc, recibo) => acc + recibo.cheque, 0);
      this.totalDepositos = this.recibos.reduce((acc, recibo) => acc + recibo.deposito, 0);
      this.totalRecibos = this.recibos.reduce((acc, recibo) => acc + recibo.total, 0);
    }
  }

  private blanquearTotalesTabla() {
    this.totalEfectivo = 0;
    this.totalCheques = 0;
    this.totalDepositos = 0;
    this.totalRecibos = 0;
  }

  eliminarRecibosViejos() {
    Swal.fire({
      title: '¿Está seguro?',
      text: 'Se eliminarán todos los recibos archivados con más de 60 días de antigüedad. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const fechaLimite = new Date();
        fechaLimite.setDate(fechaLimite.getDate() - 60);
        const limiteMs = fechaLimite.getTime();

        const recibosViejos = this.listaRecibos.filter(r => {
          if (!r.fecha) return false;
          const fechaRecibo = new Date(r.fecha).getTime();
          return fechaRecibo < limiteMs;
        });

        if (recibosViejos.length === 0) {
          Swal.fire('Sin resultados', 'No hay recibos con más de 60 días de antigüedad.', 'info');
          return;
        }

        Swal.fire({
          title: 'Espere!',
          text: `Eliminando ${recibosViejos.length} recibos antiguos...`,
          icon: 'info',
        });
        Swal.showLoading();

        let procesados = 0;
        recibosViejos.forEach(r => {
          this.fb.eliminarReciboArchivado(r.id).subscribe({
            next: () => {
              procesados++;
              if (procesados === recibosViejos.length) {
                this.fb.cargarRecibosArchivados().subscribe((resp) => {
                  this.recibos = resp;
                  this.listaRecibos = resp;
                  this.verEditar = false;
                  this.calcularTotalesTabla();
                  this.filtroSelec = ""; 
                  Swal.fire('¡Completado!', `Se han eliminado ${recibosViejos.length} recibos antiguos.`, 'success');
                });
              }
            },
            error: () => {
              procesados++;
              if (procesados === recibosViejos.length) {
                this.fb.cargarRecibosArchivados().subscribe((resp) => {
                  this.recibos = resp;
                  this.listaRecibos = resp;
                  this.verEditar = false;
                  this.calcularTotalesTabla();
                  this.filtroSelec = ""; 
                  Swal.fire('Finalizado', `Operación finalizada con algunos errores.`, 'warning');
                });
              }
            }
          });
        });
      }
    });
  }

  verRecibo(recibo) {
    this.reciboEditar = recibo;
    this.verEditar = true;
  }

  volver() {
    this.verEditar = false;
    this.reciboEditar = null;
  }
}
