import { TestBed } from '@angular/core/testing';

import { ParentrouteresolverService } from './parentrouteresolver.service';

describe('ParentrouteresolverService', () => {
  let service: ParentrouteresolverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParentrouteresolverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
