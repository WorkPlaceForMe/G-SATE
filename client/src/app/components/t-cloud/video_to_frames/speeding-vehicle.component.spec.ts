import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpeedingVehicleComponent } from './speeding-vehicle.component';

describe('SpeedingVehicleComponent', () => {
  let component: SpeedingVehicleComponent;
  let fixture: ComponentFixture<SpeedingVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpeedingVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedingVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
