import { TestBed } from '@angular/core/testing';

import { LastDeviceService } from './last-device.service';

describe('LastDeviceService', () => {
  let service: LastDeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LastDeviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
