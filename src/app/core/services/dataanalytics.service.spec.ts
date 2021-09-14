import { TestBed } from '@angular/core/testing';

import { DataanalyticsService } from './dataanalytics.service';

describe('DataanalyticsService', () => {
  let service: DataanalyticsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataanalyticsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
