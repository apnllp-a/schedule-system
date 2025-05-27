import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedulePatternListComponent } from './schedule-pattern-list.component';

describe('SchedulePatternListComponent', () => {
  let component: SchedulePatternListComponent;
  let fixture: ComponentFixture<SchedulePatternListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchedulePatternListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedulePatternListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
