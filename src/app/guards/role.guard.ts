import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { PermissionsConfig } from '../config/permissions.config';
import { Role } from '../models/roles.enum';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const userRole = this.auth.getUserRole();
    const routePath = route.routeConfig?.path;

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    const allowedRoutes = PermissionsConfig[userRole];

    if (allowedRoutes) {
      if (allowedRoutes.includes('*') || allowedRoutes.includes(routePath)) {
        return true;
      }
    }

    // Si no tiene acceso, redirigir al inicio o a login
    this.router.navigate(['/inicio']);
    return false;
  }
}
