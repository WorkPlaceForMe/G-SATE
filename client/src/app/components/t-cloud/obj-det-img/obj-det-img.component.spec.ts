import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjDetImgComponent } from './obj-det-img.component';

describe('ObjDetImgComponent', () => {
  let component: ObjDetImgComponent;
  let fixture: ComponentFixture<ObjDetImgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjDetImgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjDetImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
