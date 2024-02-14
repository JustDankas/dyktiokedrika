import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementCellComponent } from './announcement-cell.component';

describe('AnnouncementCellComponent', () => {
  let component: AnnouncementCellComponent;
  let fixture: ComponentFixture<AnnouncementCellComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnouncementCellComponent]
    });
    fixture = TestBed.createComponent(AnnouncementCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
