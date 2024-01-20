import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramItemComponent } from './program-item.component';

describe('ProgramItemComponent', () => {
  let component: ProgramItemComponent;
  let fixture: ComponentFixture<ProgramItemComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProgramItemComponent]
    });
    fixture = TestBed.createComponent(ProgramItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
