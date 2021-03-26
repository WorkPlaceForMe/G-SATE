import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectDetectionConfirmComponent } from './object-detection-confirm.component';

describe('AnnotationsConfirmComponent', () => {
  let component: ObjectDetectionConfirmComponent;
  let fixture: ComponentFixture<ObjectDetectionConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectDetectionConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectDetectionConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
