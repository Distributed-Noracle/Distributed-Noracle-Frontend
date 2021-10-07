import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {QuestionVote} from '../rest-data-model/question-vote';
import {Vote} from '../rest-data-model/vote';

@Injectable()
export class QuestionVoteService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getQuestionVotes(spaceId: string, questionId: string) {
    return this.restHelperService.get(`/spaces/${spaceId}/questions/${questionId}/votes`).then((res: QuestionVote[]) => {
      return res;
    });
  }

  public putQuestionVote(spaceId: string, questionId: string, agentId: string,
                         questionVote: QuestionVote): Promise<QuestionVote> {
    return this.restHelperService.put(`/spaces/${spaceId}/questions/${questionId}/votes/${agentId}`, questionVote)
      .then((r) => r.json() as QuestionVote);
  }
}
