import { TestBed } from '@angular/core/testing';

import { MediagalleryService } from './mediagallery.service';

describe('MediagalleryService', () => {
  let service: MediagalleryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MediagalleryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
