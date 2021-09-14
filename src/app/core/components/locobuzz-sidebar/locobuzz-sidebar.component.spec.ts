import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LocobuzzSidebarComponent } from './locobuzz-sidebar.component';

describe('LocobuzzSidebarComponent', () => {
  let component: LocobuzzSidebarComponent;
  let fixture: ComponentFixture<LocobuzzSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LocobuzzSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocobuzzSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
