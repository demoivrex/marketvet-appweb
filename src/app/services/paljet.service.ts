import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PaljetService {
  
  constructor(private http:HttpClient) { }

  generarUserPass(vendedor,color):string {
    return color ? btoa(`${vendedor}2:${vendedor}R2`) : btoa(`${vendedor}:${vendedor}R`)
  }
  
  enviarRecibo(recibo, vendedor, color){
    let userPass = this.generarUserPass(vendedor, color);
    const headers = new HttpHeaders({
      'EmpID':'1',
      'Authorization':`Basic ${userPass}` 
    });
    return this.http.post("http://fugas.bbjetcloud.com:9002/cprclientes/recibos", recibo, { headers });
  }

  getBancoSinContrapartida(vendedor, color){
    let userPass = this.generarUserPass(vendedor, color);
    const headers = new HttpHeaders({
      'EmpID':'1',
      'Authorization':`Basic ${userPass}` 
    });
    return this.http.get(`http://fugas.bbjetcloud.com:9002/cpr-sin-imputar?enttipo_id=CLI&nro_ent_id=1&moneda_id=1`, { headers });
  }
}
