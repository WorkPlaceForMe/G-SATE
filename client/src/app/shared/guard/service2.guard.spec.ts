import { TestBed, async, inject } from '@angular/core/testing';

import { Service2Guard } from './service2.guard';

describe('Service2Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Service2Guard]
    });
  });

  it('should ...', inject([Service2Guard], (guard: Service2Guard) => {
    expect(guard).toBeTruthy();
  }));
});
