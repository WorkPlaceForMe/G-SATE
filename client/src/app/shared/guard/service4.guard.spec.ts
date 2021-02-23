import { TestBed, async, inject } from '@angular/core/testing';

import { Service4Guard } from './service4.guard';

describe('Service4Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Service4Guard]
    });
  });

  it('should ...', inject([Service4Guard], (guard: Service4Guard) => {
    expect(guard).toBeTruthy();
  }));
});
