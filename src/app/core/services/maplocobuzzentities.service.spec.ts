import { TestBed } from '@angular/core/testing';

import { MaplocobuzzentitiesService } from './maplocobuzzentities.service';

describe('MaplocobuzzentitiesService', () => {
  let service: MaplocobuzzentitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaplocobuzzentitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
