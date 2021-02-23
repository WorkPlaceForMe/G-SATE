import { TestBed } from '@angular/core/testing';

import { FrService } from './fr.service';

describe('FrService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrService = TestBed.get(FrService);
    expect(service).toBeTruthy();
  });
});
