import { TestBed } from '@angular/core/testing';

import { BasicTypeService } from './basic-type.service';

describe('BasicTypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BasicTypeService = TestBed.get(BasicTypeService);
    expect(service).toBeTruthy();
  });
});
