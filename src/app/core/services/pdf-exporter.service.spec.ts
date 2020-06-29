import { TestBed } from '@angular/core/testing';

import { PdfExporterService } from './pdf-exporter.service';

describe('PdfExporterService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfExporterService = TestBed.get(PdfExporterService);
    expect(service).toBeTruthy();
  });
});
