import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomsComponent } from './buttoms.component';

describe('ButtomsComponent', () => {
  let component: ButtomsComponent;
  let fixture: ComponentFixture<ButtomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ButtomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
