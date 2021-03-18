import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationsConfirmComponent } from './annotations-confirm.component';

describe('AnnotationsConfirmComponent', () => {
  let component: AnnotationsConfirmComponent;
  let fixture: ComponentFixture<AnnotationsConfirmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationsConfirmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationsConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
