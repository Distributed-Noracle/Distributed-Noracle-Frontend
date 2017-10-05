import { TestBed, inject } from '@angular/core/testing';

import { QuestionVoteService } from './question-vote.service';

describe('QuestionVoteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuestionVoteService]
    });
  });

  it('should be created', inject([QuestionVoteService], (service: QuestionVoteService) => {
    expect(service).toBeTruthy();
  }));
});
