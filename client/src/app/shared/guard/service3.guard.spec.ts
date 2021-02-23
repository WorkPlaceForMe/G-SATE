import { TestBed, async, inject } from '@angular/core/testing';

import { Service3Guard } from './service3.guard';

describe('Service3Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Service3Guard]
    });
  });

  it('should ...', inject([Service3Guard], (guard: Service3Guard) => {
    expect(guard).toBeTruthy();
  }));
});
