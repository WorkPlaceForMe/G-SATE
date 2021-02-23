import { TestBed, async, inject } from '@angular/core/testing';

import { Service1Guard } from './service1.guard';

describe('Service1Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Service1Guard]
    });
  });

  it('should ...', inject([Service1Guard], (guard: Service1Guard) => {
    expect(guard).toBeTruthy();
  }));
});
