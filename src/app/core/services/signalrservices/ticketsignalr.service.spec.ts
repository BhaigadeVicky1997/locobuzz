import { TestBed } from '@angular/core/testing';

import { TicketsignalrService } from './ticketsignalr.service';

describe('TicketsignalrService', () => {
  let service: TicketsignalrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TicketsignalrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
