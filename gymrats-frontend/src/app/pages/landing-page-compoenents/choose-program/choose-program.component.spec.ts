import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseProgramComponent } from './choose-program.component';

describe('ChooseProgramComponent', () => {
  let component: ChooseProgramComponent;
  let fixture: ComponentFixture<ChooseProgramComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChooseProgramComponent]
    });
    fixture = TestBed.createComponent(ChooseProgramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
