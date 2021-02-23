import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnwantedVehicleComponent } from './unwanted-vehicle.component';

describe('UnwantedVehicleComponent', () => {
  let component: UnwantedVehicleComponent;
  let fixture: ComponentFixture<UnwantedVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnwantedVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnwantedVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
