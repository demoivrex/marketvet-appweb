import { Component, OnInit } from '@angular/core';
import { FirebaseService } from 'src/app/services/firebase.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';

@Component({
  selector: 'app-vital',
  templateUrl: './vital.component.html',
  styleUrls: ['./vital.component.css']
})
export class VitalComponent implements OnInit {
  kilosVital: any[] = [];
  mes: number = 1;
  ano: number = new Date().getFullYear();

  constructor(
    private firebaseService: FirebaseService
  ) { }

  ngOnInit(): void { }

  buscarDatoMes(mes: number) {
    this.firebaseService.getKilosVital(mes.toString(), this.ano.toString()).subscribe((data: any) => {
      if (data) {

        this.kilosVital = this.filtrarClientes(data);
      }
    });
  }

  filtrarClientes(kilosVital) {
    kilosVital.sort((a, b) => b.kilos - a.kilos);
    return kilosVital.filter(item => item.kilos > 100);
  }

  async generarExcel() {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Reporte');

    // Estilos
    const titleStyle: any = { font: { bold: true, size: 14 } };
    const headerStyle: any = { font: { bold: true } };
    const currencyFormat = '"$"#,##0.00';
    const numberFormat = '#,##0';

    // 1. TITULO (Fila 1)
    worksheet.mergeCells('A1:I1');
    worksheet.getCell('A1').value = 'Tabla de kilos Vital mensuales';
    worksheet.getCell('A1').font = titleStyle;
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // 2. MES (Fila 2)
    const meses = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    const mesNombre = meses[this.mes - 1] || 'MES FINAL';
    worksheet.mergeCells('A2:I2');
    worksheet.getCell('A2').value = `MES: ${mesNombre} ${this.ano}`;
    worksheet.getCell('A2').font = { bold: true, size: 12 } as any;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // 3. HEADERS (Fila 3)
    const headers = ['Cliente', 'Kilos', 'Therapy', 'Wet', 'Balanced', 'Complete', 'Balanced NR', 'Nutrique', 'Precio'];
    const headerRow = worksheet.getRow(3);
    headerRow.values = headers;
    headerRow.eachCell((cell) => {
      cell.font = headerStyle;
      cell.border = { bottom: { style: 'thin' } };
    });

    // 4. DATA (Fila 4 en adelante)
    let currentRow = 4;
    this.kilosVital.forEach(kilo => {
      const row = worksheet.getRow(currentRow);
      row.getCell(1).value = kilo.cliente;
      row.getCell(2).value = kilo.kilos;
      row.getCell(2).numFmt = numberFormat;
      row.getCell(3).value = kilo.therapy;
      row.getCell(3).numFmt = numberFormat;
      row.getCell(4).value = kilo.wet;
      row.getCell(4).numFmt = numberFormat;
      row.getCell(5).value = kilo.balanced;
      row.getCell(5).numFmt = numberFormat;
      row.getCell(6).value = kilo.complete;
      row.getCell(6).numFmt = numberFormat;
      row.getCell(7).value = kilo.balancedNR;
      row.getCell(7).numFmt = numberFormat;
      row.getCell(8).value = kilo.nutrique;
      row.getCell(8).numFmt = numberFormat;
      row.getCell(9).value = kilo.ventas;
      row.getCell(9).numFmt = currencyFormat;
      currentRow++;
    });

    // Auto-width columns
    worksheet.columns.forEach(column => {
      column.width = 15;
    });
    worksheet.getColumn(1).width = 30; // Cliente column wider

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    fs.saveAs(blob, `Reporte_Vital_${mesNombre}_${this.ano}.xlsx`);
  }
}