import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjDetMulImgsComponent } from './obj-det-mul-imgs.component';

describe('ObjDetMulImgsComponent', () => {
  let component: ObjDetMulImgsComponent;
  let fixture: ComponentFixture<ObjDetMulImgsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjDetMulImgsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjDetMulImgsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
