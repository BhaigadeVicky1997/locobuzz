import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostMinimalComponent } from './post-minimal.component';

describe('PostMinimalComponent', () => {
  let component: PostMinimalComponent;
  let fixture: ComponentFixture<PostMinimalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostMinimalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostMinimalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
