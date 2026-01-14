import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagementOverview } from './management-overview';

describe('ManagementOverview', () => {
  let component: ManagementOverview;
  let fixture: ComponentFixture<ManagementOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagementOverview]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagementOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
