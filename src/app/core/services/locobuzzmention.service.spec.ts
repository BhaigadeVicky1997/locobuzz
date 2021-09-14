import { TestBed } from '@angular/core/testing';

import { LocobuzzmentionService } from './locobuzzmention.service';

describe('LocobuzzmentionService', () => {
  let service: LocobuzzmentionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocobuzzmentionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
