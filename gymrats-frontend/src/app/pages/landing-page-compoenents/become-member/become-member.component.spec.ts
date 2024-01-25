import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeMemberComponent } from './become-member.component';

describe('BecomeMemberComponent', () => {
  let component: BecomeMemberComponent;
  let fixture: ComponentFixture<BecomeMemberComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BecomeMemberComponent]
    });
    fixture = TestBed.createComponent(BecomeMemberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
