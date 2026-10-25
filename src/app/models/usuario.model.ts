import { Role } from './roles.enum';

export class UsuarioModel {
    email: string;
    password: string;
    nombre: string;
    role?: Role;
}