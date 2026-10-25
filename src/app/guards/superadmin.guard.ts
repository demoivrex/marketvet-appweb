import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

export class SuperAdminGuard implements CanActivate {
  constructor(private router:Router){}

  canActivate(): boolean {
    const user = localStorage.getItem('user');
    if ( user == "alfredorfugas@hotmail.com" || 
        user == "alfredoraulfugas@gmail.com" ||
        user == "bioing.equiroz@gmail.com" || 
        user == "walter_spector@hotmail.com" ||
        user == "rominagetti@hotmail.com") {
            return true;
    } else {
        this.router.navigateByUrl('/inicio');
    }
  }
}