import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamerasButtomsComponent } from './cameras-buttoms.component';

describe('CamerasButtomsComponent', () => {
  let component: CamerasButtomsComponent;
  let fixture: ComponentFixture<CamerasButtomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamerasButtomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamerasButtomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
