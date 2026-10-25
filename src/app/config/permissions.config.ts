import { Role } from '../models/roles.enum';

export const PermissionsConfig: Record<Role, string[]> = {
  [Role.SUPERUSER]: ['*'], // '*' significa acceso a todas las rutas
  [Role.SUPERVISOR]: [
    'inicio',
    'empleados',
    'empleados-adicionales',
    'objetivos',
    'objetivos-vendedores',
    'objetivos-categoria',
    'objetivos-control',
    'objetivos-graficos',
    'graficos',
    'rentabilidad',
    'vital-admin',
    'vital',
    'cuenta-corriente',
  ],
  [Role.DIGITAL]: [
    'inicio',
    'rentabilidad',
    'objetivos',
    'objetivos-vendedores',
    'objetivos-categoria',
    'objetivos-control',
    'objetivos-graficos',
    'graficos',
    'ventas-digital'],
  [Role.ADMINISTRACION]: [
    'inicio',
    'aprobacion-recibos',
    'recibos-archivados',
    'cuenta-corriente',
    'objetivos',
    'objetivos-vendedores',
    'objetivos-categoria',
    'objetivos-control',
    'objetivos-graficos',
    'graficos',
  ],
};
