import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoiteringDetectionComponent } from './loitering-detection.component';

describe('LoiteringDetectionComponent', () => {
  let component: LoiteringDetectionComponent;
  let fixture: ComponentFixture<LoiteringDetectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoiteringDetectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoiteringDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
