import { TestBed } from '@angular/core/testing';

import { MerchandisingService } from './merchandising.service';

describe('MerchandisingService', () => {
  let service: MerchandisingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MerchandisingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
