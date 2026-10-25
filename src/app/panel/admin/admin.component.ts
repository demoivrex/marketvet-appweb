import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { jqxGridComponent } from 'jqwidgets-ng/jqxgrid';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AdminComponent implements OnInit {

  recibos:any[] = [];

  /* jqxGrid */
  @ViewChild('grid', { static: false }) grid: jqxGridComponent;
  columns = [
    {text: 'Fecha', datafield: 'fecha'},
    {text: 'Vendedor', datafield: 'vendedor'},
    {text: 'Cliente', datafield: 'cliente'},
    {text: 'Efectivo', datafield: 'efectivo'},
    {text: 'Cheques', datafield: 'cheque'},
    {text: 'Depositos', datafield: 'deposito'},
    {text: 'Total', datafield: 'total'},
  ];
  source = new jqx.dataAdapter(this.recibos);
  /* jqxGrid end */ 

  constructor(private fb:FirebaseService) { }

  ngOnInit(): void {
    this.fb.cargarRecibos().subscribe(resp=>{
      this.recibos = resp;
      this.source = jqx.dataAdapter(resp);
    })
  }

}
