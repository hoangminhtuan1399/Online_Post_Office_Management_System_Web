import { TestBed } from '@angular/core/testing';

import { TrackingPopoverService } from './tracking-popover.service';

describe('TrackingPopoverService', () => {
  let service: TrackingPopoverService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingPopoverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
