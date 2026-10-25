import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { PermissionsConfig } from 'src/app/config/permissions.config';
import { Role } from 'src/app/models/roles.enum';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private auth: AuthService) { }
  ngOnInit(): void {}

  canAccess(route: string): boolean {
    const userRole = this.auth.getUserRole();
    if (!userRole) return false;
    
    const allowedRoutes = PermissionsConfig[userRole];
    if (allowedRoutes) {
      return allowedRoutes.includes('*') || allowedRoutes.includes(route);
    }
    return false;
  }
}

