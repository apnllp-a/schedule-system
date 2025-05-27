import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarHrComponent } from './calendar-hr.component';

describe('CalendarHrComponent', () => {
  let component: CalendarHrComponent;
  let fixture: ComponentFixture<CalendarHrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalendarHrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarHrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
