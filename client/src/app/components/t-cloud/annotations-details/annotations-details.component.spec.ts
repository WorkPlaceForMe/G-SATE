import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnotationsDetailsComponent } from './annotations-details.component';

describe('AnnotationsDetailsComponent', () => {
  let component: AnnotationsDetailsComponent;
  let fixture: ComponentFixture<AnnotationsDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnotationsDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnotationsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
