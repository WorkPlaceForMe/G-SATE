import { TestBed, async, inject } from '@angular/core/testing';

import { Service6Guard } from './service6.guard';

describe('Service6Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Service6Guard]
    });
  });

  it('should ...', inject([Service6Guard], (guard: Service6Guard) => {
    expect(guard).toBeTruthy();
  }));
});
