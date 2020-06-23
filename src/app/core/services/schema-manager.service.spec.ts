import { TestBed } from '@angular/core/testing';

import { SchemaManagerService } from './schema-manager.service';

describe('SchemaManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchemaManagerService = TestBed.get(SchemaManagerService);
    expect(service).toBeTruthy();
  });
});
