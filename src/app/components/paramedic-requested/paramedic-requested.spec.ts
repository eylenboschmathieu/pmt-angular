import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamedicRequestedComponent } from './paramedic-requested';

describe('ParamedicRequested', () => {
  let component: ParamedicRequestedComponent;
  let fixture: ComponentFixture<ParamedicRequestedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamedicRequestedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamedicRequestedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
