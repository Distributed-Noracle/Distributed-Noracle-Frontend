import { TestBed, inject } from '@angular/core/testing';

import { RestHelperService } from './rest-helper.service';

describe('RestHelperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RestHelperService]
    });
  });

  it('should be created', inject([RestHelperService], (service: RestHelperService) => {
    expect(service).toBeTruthy();
  }));
});
