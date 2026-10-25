import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioModel } from '../../models/usuario.model';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  usuario: UsuarioModel;

  constructor(private auth:AuthService) { }

  ngOnInit(): void {
    this.usuario = new UsuarioModel();
  }

  onSubmit() {
    this.auth.registro(this.usuario).subscribe();
  }


}
