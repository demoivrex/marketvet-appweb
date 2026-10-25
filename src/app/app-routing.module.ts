import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { AdminComponent } from './panel/admin/admin.component';
import { InicioComponent } from './panel/inicio/inicio.component';
import { AprobacionRecibosComponent } from './panel/aprobacion-recibos/aprobacion-recibos.component';
import { ObjetivosComponent } from './panel/objetivos/objetivos.component';
import { ObjetivosVendedoresComponent } from './panel/objetivos-vendedores/objetivos-vendedores.component';
import { ObjetivosCategoriaComponent } from './panel/objetivos-categoria/objetivos-categoria.component';
import { ObjetivosPanelComponent } from './panel/objetivos-panel/objetivos-panel.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';
import { AdministracionGuard } from './guards/administracion.guard';
import { ObjetivosGraficasComponent } from './panel/objetivos-graficas/objetivos-graficas.component';
import { GraficasComponent } from './panel/graficas/graficas.component';
import { VentasDigitalComponent } from './panel/ventas-digital/ventas-digital.component';
import { EmpleadosComponent } from './panel/empleados/empleados.component';
import { EmpleadosAdicionalesComponent } from './panel/empleados-adicionales/empleados-adicionales.component';
import { LiquidacionEmpleadosComponent } from './panel/liquidacion-empleados/liquidacion-empleados.component';
import { ObjComponent } from './panel/obj/obj.component';
import { VitalAdminComponent } from './panel/vital-admin/vital-admin.component';
import { SuperAdminGuard } from './guards/superadmin.guard';
import { VitalComponent } from './panel/vital/vital.component';
import { RecibosArchivadosComponent } from './panel/recibos-archivados/recibos-archivados.component';
import { RentabilidadVendedoresComponent } from './panel/rentabilidad-vendedores/rentabilidad-vendedores.component';
import { CuentaCorrienteComponent } from './panel/cuenta-corriente/cuenta-corriente.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'panel', component: AdminComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'inicio', component: InicioComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'aprobacion-recibos', component: AprobacionRecibosComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'recibos-archivados', component: RecibosArchivadosComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'objetivos', component: ObjetivosComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'objetivos-vendedores', component: ObjetivosVendedoresComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'objetivos-categoria', component: ObjetivosCategoriaComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'objetivos-control', component: ObjetivosPanelComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'objetivos-graficos', component: ObjetivosGraficasComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'graficos', component: GraficasComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'ventas-digital', component: VentasDigitalComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'empleados', component: EmpleadosComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'liquidacion-empleados', component: LiquidacionEmpleadosComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'empleados-adicionales', component: EmpleadosAdicionalesComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'obj', component: ObjComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'vital-admin', component: VitalAdminComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'vital', component: VitalComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'rentabilidad', component: RentabilidadVendedoresComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: 'cuenta-corriente', component: CuentaCorrienteComponent, canActivate: [AuthGuard, RoleGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
