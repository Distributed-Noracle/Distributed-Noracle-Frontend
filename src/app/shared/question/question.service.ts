import {Injectable} from '@angular/core';
import { environment } from 'src/environments/environment';
import {Question} from '../rest-data-model/question';
import {RestHelperService} from '../rest-helper/rest-helper.service';

@Injectable()
export class QuestionService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getQuestionsOfSpace(spaceId: string): Promise<Question[]> {
    // TODO: proper pagination
    return this.restHelperService.get(`/spaces/${spaceId}/questions?limit=1000`)
      .then((res: Question[]) => {
      return res;
    });
  }

  public postQuestion(spaceId: string, question: Question): Promise<Question> {
    return this.restHelperService.post(`/spaces/${spaceId}/questions`, question).then((res) => {
      // TODO: Hacky hack, needs to be fixed by the backend!
      let location: string = res.headers.get('location');
      if (environment.production) {
        location = location.replace("http", "https");
      }
      return this.restHelperService.getAbsoulte(location)
        .then((r: Question) => {
          return r;
        });
    });
  }

  public putQuestion(spaceId: string, questionId: string, question: Question): Promise<Question> {
    return this.restHelperService.put(`/spaces/${spaceId}/questions/${questionId}`, question)
      .then((r: Question) => r);
  }

}
