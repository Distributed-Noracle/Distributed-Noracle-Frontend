import {Injectable} from '@angular/core';
import {Question} from '../rest-data-model/question';
import {RestHelperService} from '../rest-helper/rest-helper.service';

@Injectable()
export class QuestionService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getQuestionsOfSpace(spaceId: string): Promise<Question[]> {
    // TODO: proper pagination
    return this.restHelperService.get(`/spaces/${spaceId}/questions?limit=1000`).toPromise().then((res) => {
      return res.json() as Question[];
    });
  }

  public postQuestion(spaceId: string, question: Question): Promise<Question> {
    return this.restHelperService.post(`/spaces/${spaceId}/questions`, question).toPromise().then((res) => {
      return this.restHelperService.getAbsoulte(res.headers.get('location')).toPromise()
        .then((r) => r.json() as Question);
    });
  }

  public putQuestion(spaceId: string, questionId: string, question: Question): Promise<Question> {
    return this.restHelperService.put(`/spaces/${spaceId}/questions/${questionId}`, question).toPromise()
      .then((r) => r.json() as Question);
  }

}
