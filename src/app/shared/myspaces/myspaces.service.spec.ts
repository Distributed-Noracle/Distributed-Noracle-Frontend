import { TestBed, inject } from '@angular/core/testing';

import { MyspacesService } from './myspaces.service';

describe('MyspacesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MyspacesService]
    });
  });

  it('should be created', inject([MyspacesService], (service: MyspacesService) => {
    expect(service).toBeTruthy();
  }));
});
