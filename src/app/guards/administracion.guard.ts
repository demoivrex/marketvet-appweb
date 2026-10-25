import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SuperAdminGuard } from './superadmin.guard';

@Injectable({
  providedIn: 'root'
})

export class AdministracionGuard implements CanActivate {
  constructor(private router: Router, private superAdminGuard: SuperAdminGuard) { }

  canActivate(): boolean {
    if (this.superAdminGuard.canActivate()) {
      return true;
    }

    const user = localStorage.getItem('user');
    if (user == "marketvet.online@gmail.com" ||
      user == "gimena.discomercial@gmail.com" ||
      user == "emmanuel.discomercial@gmail.com" ||
      user == "ramiro.discomercial@gmail.com" ||
      user == "adm.marketvet@gmail.com") {
      return true;
    } else {
      this.router.navigateByUrl('/inicio');
    }
  }

  // checkAdmin(): boolean {
  //   const user = localStorage.getItem('user');
  //   if ( user == "marketvet.online@gmail.com" || 
  //         user == "gimena.discomercial@gmail.com" || 
  //         user == "emmanuel.discomercial@gmail.com" || 
  //         user == "ramiro.discomercial@gmail.com" || 
  //         user == "ivanchiardola@gmail.com" || 
  //         user == "adm.marketvet@gmail.com" || 
  //         user == "contablemarketvet@gmail.com") {
  //   } else {
  //     return true;
  //   }
  // }

  // accesoTotal(): boolean {
  //   const user = localStorage.getItem('user');
  //   if ( user == "alfredorfugas@hotmail.com" || 
  //         user == "alfredoraulfugas@gmail.com" ||
  //         user == "bioing.equiroz@gmail.com") {
  //     return true
  //   } else {
  //     this.router.navigateByUrl('/inicio');
  //   }
  // }

  accesoEdicionObjetivos(): boolean {
    const user = localStorage.getItem('user');
    if (user == "emmanuel.discomercial@gmail.com" || user == "bioing.equiroz@gmail.com") {
      return true
    } else {
      return false;
    }
  }
}
