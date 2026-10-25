import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  usuario:string = '';

  constructor(private auth:AuthService,
              private router:Router) { }

  ngOnInit(): void {
    this.cargarUsuario();
  }

  cargarUsuario() {
    this.usuario = localStorage.getItem('user');
  }

  salir() {
    this.auth.logout();
    this.router.navigateByUrl('/login')
  }
}
