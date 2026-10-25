import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { jqxGridModule } from 'jqwidgets-ng/jqxgrid';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { NavbarComponent } from './panel/shared/navbar/navbar.component';
import { FooterComponent } from './panel/shared/footer/footer.component';
import { ToolbarComponent } from './panel/shared/toolbar/toolbar.component';
import { AdminComponent } from './panel/admin/admin.component';
import { HttpClientModule } from '@angular/common/http';
import { InicioComponent } from './panel/inicio/inicio.component';
import { AprobacionRecibosComponent } from './panel/aprobacion-recibos/aprobacion-recibos.component';
import { RegistroComponent } from './auth/registro/registro.component';
import { ObjetivosComponent } from './panel/objetivos/objetivos.component';
import { ObjetivosVendedoresComponent } from './panel/objetivos-vendedores/objetivos-vendedores.component';
import { ObjetivosCategoriaComponent } from './panel/objetivos-categoria/objetivos-categoria.component';
import { ObjetivosPanelComponent } from './panel/objetivos-panel/objetivos-panel.component';
import { ObjetivosGraficasComponent } from './panel/objetivos-graficas/objetivos-graficas.component';
import { GraficasComponent } from './panel/graficas/graficas.component';
import { VentasDigitalComponent } from './panel/ventas-digital/ventas-digital.component';
import { EmpleadosComponent } from './panel/empleados/empleados.component';
import { LiquidacionEmpleadosComponent } from './panel/liquidacion-empleados/liquidacion-empleados.component';
import localeEs from '@angular/common/locales/es';
import localeEsAr from '@angular/common/locales/es-AR';
import { registerLocaleData } from '@angular/common';
import { EmpleadosAdicionalesComponent } from './panel/empleados-adicionales/empleados-adicionales.component';
import { ObjComponent } from './panel/obj/obj.component';
import { VitalAdminComponent } from './panel/vital-admin/vital-admin.component';
import { VitalComponent } from './panel/vital/vital.component';
import { RecibosArchivadosComponent } from './panel/recibos-archivados/recibos-archivados.component';
import { RentabilidadVendedoresComponent } from './panel/rentabilidad-vendedores/rentabilidad-vendedores.component';
import { CuentaCorrienteComponent } from './panel/cuenta-corriente/cuenta-corriente.component';

registerLocaleData(localeEsAr, 'es-Ar');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    ToolbarComponent,
    AdminComponent,
    InicioComponent,
    AprobacionRecibosComponent,
    RegistroComponent,
    ObjetivosComponent,
    ObjetivosVendedoresComponent,
    ObjetivosCategoriaComponent,
    ObjetivosPanelComponent,
    ObjetivosGraficasComponent,
    GraficasComponent,
    VentasDigitalComponent,
    EmpleadosComponent,
    LiquidacionEmpleadosComponent,
    EmpleadosAdicionalesComponent,
    ObjComponent,
    VitalAdminComponent,
    VitalComponent,
    RecibosArchivadosComponent,
    RentabilidadVendedoresComponent,
    CuentaCorrienteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    jqxGridModule,
    FormsModule,
    ChartsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'es-Ar' }],
  bootstrap: [AppComponent],
})
export class AppModule {}
