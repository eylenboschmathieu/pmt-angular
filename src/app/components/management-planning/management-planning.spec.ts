import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementPlanningComponent } from './management-planning';

describe('ManagementPlanning', () => {
  let component: ManagementPlanningComponent;
  let fixture: ComponentFixture<ManagementPlanningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementPlanningComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementPlanningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
