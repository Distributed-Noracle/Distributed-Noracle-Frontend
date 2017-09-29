import { TestBed, inject } from '@angular/core/testing';

import { RelationService } from './relation.service';

describe('RelationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelationService]
    });
  });

  it('should be created', inject([RelationService], (service: RelationService) => {
    expect(service).toBeTruthy();
  }));
});
