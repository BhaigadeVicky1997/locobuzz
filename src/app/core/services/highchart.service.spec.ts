import { TestBed } from '@angular/core/testing';

import { HighchartService } from './highchart.service';

describe('HighchartService', () => {
  let service: HighchartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HighchartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
