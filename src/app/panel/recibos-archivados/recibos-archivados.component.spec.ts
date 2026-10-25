import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecibosArchivadosComponent } from './recibos-archivados.component';

describe('RecibosArchivadosComponent', () => {
  let component: RecibosArchivadosComponent;
  let fixture: ComponentFixture<RecibosArchivadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecibosArchivadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecibosArchivadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
