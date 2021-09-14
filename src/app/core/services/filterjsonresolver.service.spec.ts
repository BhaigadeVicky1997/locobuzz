import { TestBed } from '@angular/core/testing';

import { FilterjsonresolverService } from './filterjsonresolver.service';

describe('FilterjsonresolverService', () => {
  let service: FilterjsonresolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterjsonresolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
