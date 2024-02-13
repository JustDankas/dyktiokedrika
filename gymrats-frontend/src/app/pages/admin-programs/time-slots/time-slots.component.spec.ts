import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeSlotsComponent } from './time-slots.component';

describe('TimeSlotsComponent', () => {
  let component: TimeSlotsComponent;
  let fixture: ComponentFixture<TimeSlotsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TimeSlotsComponent]
    });
    fixture = TestBed.createComponent(TimeSlotsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
