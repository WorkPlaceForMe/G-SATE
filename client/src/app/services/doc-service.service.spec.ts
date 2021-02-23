import { TestBed } from '@angular/core/testing';

import { DocServiceService } from './doc-service.service';

describe('DocServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocServiceService = TestBed.get(DocServiceService);
    expect(service).toBeTruthy();
  });
});
