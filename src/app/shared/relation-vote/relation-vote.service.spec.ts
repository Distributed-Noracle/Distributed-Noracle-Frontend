import { TestBed, inject } from '@angular/core/testing';

import { RelationVoteService } from './relation-vote.service';

describe('RelationVoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RelationVoteService]
    });
  });

  it('should be created', inject([RelationVoteService], (service: RelationVoteService) => {
    expect(service).toBeTruthy();
  }));
});
