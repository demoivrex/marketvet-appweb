import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentabilidadVendedoresComponent } from './rentabilidad-vendedores.component';

describe('RentabilidadVendedoresComponent', () => {
  let component: RentabilidadVendedoresComponent;
  let fixture: ComponentFixture<RentabilidadVendedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentabilidadVendedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentabilidadVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
