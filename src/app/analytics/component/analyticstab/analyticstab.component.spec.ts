import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticstabComponent } from './analyticstab.component';

describe('AnalyticstabComponent', () => {
  let component: AnalyticstabComponent;
  let fixture: ComponentFixture<AnalyticstabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticstabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticstabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
