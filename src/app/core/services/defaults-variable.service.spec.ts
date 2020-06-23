import { TestBed } from '@angular/core/testing';

import { DefaultsVariableService } from './defaults-variable.service';

describe('DefaultsVariableService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DefaultsVariableService = TestBed.get(DefaultsVariableService);
    expect(service).toBeTruthy();
  });
});
