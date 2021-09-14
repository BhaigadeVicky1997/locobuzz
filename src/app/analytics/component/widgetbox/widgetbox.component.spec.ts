import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WidgetboxComponent } from './widgetbox.component';

describe('WidgetboxComponent', () => {
  let component: WidgetboxComponent;
  let fixture: ComponentFixture<WidgetboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WidgetboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WidgetboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
