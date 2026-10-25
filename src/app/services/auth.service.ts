import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaderResponse } from '@angular/common/http';
import { UsuarioModel } from '../models/usuario.model';
import { map, switchMap } from 'rxjs/operators';
import { Role } from '../models/roles.enum';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userToken: string = '';
  userRole: Role = Role.ADMINISTRACION; // Por defecto o vacío

  constructor(private http: HttpClient) {
    // Intentar leer el token al inicializar el servicio
    this.leerToken();
  }

  login(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCbvC-B09uUkUUxOSb_R1FgDpQMjjP8wzo',
        authData
      )
      .pipe(
        switchMap((resp: any) => {
          this.guardarToken(resp['idToken']);
          this.guardarUser(resp['email']);
          const uid = resp['localId'];

          return this.http.get(`https://recibosaf-c64ad.firebaseio.com/usuarios/${uid}/role.json`).pipe(
            map((roleResp: any) => {
              // Asignar rol por defecto si no tiene
              const role = roleResp ? (roleResp as Role) : Role.SUPERVISOR;
              this.guardarRole(role);
              return resp;
            })
          );
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.userToken = '';
    this.userRole = null;
  }

  registro(usuario: UsuarioModel) {
    const authData = {
      ...usuario,
      returnSecureToken: true,
    };
    return this.http
      .post(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCbvC-B09uUkUUxOSb_R1FgDpQMjjP8wzo',
        authData
      )
      .pipe(
        map((resp) => {
          this.guardarToken(resp['idToken']);
          return resp;
        })
      );
  }

  private guardarToken(idToken: string) {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);
  }

  private guardarUser(user: string) {
    localStorage.setItem('user', user);
  }

  private guardarRole(role: Role) {
    this.userRole = role;
    localStorage.setItem('role', role);
  }

  getUserRole(): Role {
    return this.userRole;
  }

  private leerToken() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.userToken = storedToken;
    }
    const storedRole = localStorage.getItem('role');
    if (storedRole) {
      this.userRole = storedRole as Role;
    }
  }

  tieneCredenciales(): boolean {
    return this.userToken.length > 2;
  }
}
