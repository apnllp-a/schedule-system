import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderHeadComponent } from './header-head.component';

describe('HeaderHeadComponent', () => {
  let component: HeaderHeadComponent;
  let fixture: ComponentFixture<HeaderHeadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderHeadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderHeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
