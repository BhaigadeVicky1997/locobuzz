import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectbrandWizardComponent } from './selectbrand-wizard.component';

describe('SelectbrandWizardComponent', () => {
  let component: SelectbrandWizardComponent;
  let fixture: ComponentFixture<SelectbrandWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectbrandWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectbrandWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
