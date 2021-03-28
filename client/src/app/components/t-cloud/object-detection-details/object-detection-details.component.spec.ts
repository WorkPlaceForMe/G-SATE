import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectDetectionDetailsComponent } from './object-detection-details.component';

describe('AnnotationsDetailsComponent', () => {
  let component: ObjectDetectionDetailsComponent ;
  let fixture: ComponentFixture<ObjectDetectionDetailsComponent >;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectDetectionDetailsComponent  ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectDetectionDetailsComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
