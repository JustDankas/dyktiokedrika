import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertTrainersComponent } from './expert-trainers.component';

describe('ExpertTrainersComponent', () => {
  let component: ExpertTrainersComponent;
  let fixture: ComponentFixture<ExpertTrainersComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpertTrainersComponent]
    });
    fixture = TestBed.createComponent(ExpertTrainersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
