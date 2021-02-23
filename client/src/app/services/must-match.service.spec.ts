import { TestBed } from '@angular/core/testing';

import { MustMatchService } from './must-match.service';

describe('MustMatchService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MustMatchService = TestBed.get(MustMatchService);
    expect(service).toBeTruthy();
  });
});
