import { TestBed } from '@angular/core/testing';

import { CalculatorManagerService } from './calculator-manager.service';

describe('CalculatorManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CalculatorManagerService = TestBed.get(CalculatorManagerService);
    expect(service).toBeTruthy();
  });
});
