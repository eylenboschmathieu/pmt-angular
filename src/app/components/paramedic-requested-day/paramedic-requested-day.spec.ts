import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayShiftRequest } from './paramedic-requested-day';

describe('DayShiftRequest', () => {
  let component: DayShiftRequest;
  let fixture: ComponentFixture<DayShiftRequest>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DayShiftRequest]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DayShiftRequest);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
