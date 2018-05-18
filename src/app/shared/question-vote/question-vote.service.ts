import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {QuestionVote} from '../rest-data-model/question-vote';

@Injectable()
export class QuestionVoteService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getQuestionVotes(spaceId: string, questionId: string) {
    return this.restHelperService.get(`/spaces/${spaceId}/questions/${questionId}/votes`).then((res) => {
      return res.json() as QuestionVote[];
    });
  }

  public putQuestionVote(spaceId: string, questionId: string, agentId: string,
                         questionVote: QuestionVote): Promise<QuestionVote> {
    return this.restHelperService.put(`/spaces/${spaceId}/questions/${questionId}/votes/${agentId}`, questionVote)
      .then((r) => r.json() as QuestionVote);
  }

  public count(votes: QuestionVote[]): {good: number, neutral: number, bad: number, total: number} {
    let good = 0;
    let neutral = 0;
    let bad = 0;
    votes.forEach(vote => {
      switch (vote.value) {
        case -1:
          bad ++;
          break;
        case 0:
          neutral ++;
          break;
        case 1:
          good ++;
          break;
      }
    });
    return {
      good: good,
      neutral: neutral,
      bad: bad,
      total: good + bad + neutral
    }
  }
}
