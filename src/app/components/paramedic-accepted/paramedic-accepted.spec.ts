import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParamedicAcceptedComponent } from './paramedic-accepted';

describe('ParamedicAccepted', () => {
  let component: ParamedicAcceptedComponent;
  let fixture: ComponentFixture<ParamedicAcceptedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ParamedicAcceptedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ParamedicAcceptedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
