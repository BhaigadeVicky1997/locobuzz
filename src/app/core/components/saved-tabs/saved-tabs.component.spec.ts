import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedTabsComponent } from './saved-tabs.component';

describe('SavedTabsComponent', () => {
  let component: SavedTabsComponent;
  let fixture: ComponentFixture<SavedTabsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedTabsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
