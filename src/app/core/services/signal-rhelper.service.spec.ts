import { TestBed } from '@angular/core/testing';

import { SignalRHelperService } from './signal-rhelper.service';

describe('SignalRHelperService', () => {
  let service: SignalRHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SignalRHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
