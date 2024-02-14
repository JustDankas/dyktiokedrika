import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserEditModalComponent } from './user-edit-modal.component';

describe('UserEditModalComponent', () => {
  let component: UserEditModalComponent;
  let fixture: ComponentFixture<UserEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserEditModalComponent]
    });
    fixture = TestBed.createComponent(UserEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
