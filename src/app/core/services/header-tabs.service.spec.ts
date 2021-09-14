import { TestBed } from '@angular/core/testing';

import { HeaderTabsService } from './header-tabs.service';

describe('HeaderTabsService', () => {
  let service: HeaderTabsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeaderTabsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
