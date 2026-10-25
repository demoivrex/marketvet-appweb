import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioModel } from '../../models/usuario.model';
import { AuthService } from '../../services/auth.service';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(private LOG:LogService, private auth:AuthService, private router:Router) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel();
  }

  onSubmit() {
    this.auth.login(this.usuario).subscribe(
      resp => {
        if (localStorage.getItem('token')) {
          this.LOG.usuario = this.usuario.email;
          this.router.navigateByUrl('/inicio');
        }
      }, (err) => {}
    )
  }

}
