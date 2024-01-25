import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectBoxComponent } from './select-box.component';

describe('SelectBoxComponent', () => {
  let component: SelectBoxComponent;
  let fixture: ComponentFixture<SelectBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SelectBoxComponent]
    });
    fixture = TestBed.createComponent(SelectBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
