import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramAppointmentComponent } from './program-appointment.component';

describe('ProgramAppointmentComponent', () => {
  let component: ProgramAppointmentComponent;
  let fixture: ComponentFixture<ProgramAppointmentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramAppointmentComponent]
    });
    fixture = TestBed.createComponent(ProgramAppointmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
