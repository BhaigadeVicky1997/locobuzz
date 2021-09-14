import { TestBed } from '@angular/core/testing';

import { RouteguidResolverService } from './routeguid-resolver.service';

describe('RouteguidResolverService', () => {
  let service: RouteguidResolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RouteguidResolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
