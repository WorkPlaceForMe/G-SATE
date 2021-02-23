import { TestBed, async, inject } from '@angular/core/testing';

import { Service5Guard } from './service5.guard';

describe('Service5Guard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Service5Guard]
    });
  });

  it('should ...', inject([Service5Guard], (guard: Service5Guard) => {
    expect(guard).toBeTruthy();
  }));
});
