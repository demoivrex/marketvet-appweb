import { TestBed } from '@angular/core/testing';

import { AdministracionGuard } from './administracion.guard';

describe('AdministracionGuard', () => {
  let guard: AdministracionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AdministracionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
