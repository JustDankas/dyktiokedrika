import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OurClassesComponent } from './our-classes.component';

describe('OurClassesComponent', () => {
  let component: OurClassesComponent;
  let fixture: ComponentFixture<OurClassesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OurClassesComponent]
    });
    fixture = TestBed.createComponent(OurClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
