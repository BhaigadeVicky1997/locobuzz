import { TestBed } from '@angular/core/testing';

import { TagCategoryService } from './tag-category.service';

describe('TagCategoryService', () => {
  let service: TagCategoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TagCategoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
