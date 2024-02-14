import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementEditModalComponent } from './announcement-edit-modal.component';

describe('AnnouncementEditModalComponent', () => {
  let component: AnnouncementEditModalComponent;
  let fixture: ComponentFixture<AnnouncementEditModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnouncementEditModalComponent]
    });
    fixture = TestBed.createComponent(AnnouncementEditModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
