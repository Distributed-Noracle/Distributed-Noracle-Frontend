import { Injectable } from '@angular/core';
import {RestService} from '../shared/rest-service/rest.service';
import {Question} from '../shared/rest-data-model/question';

@Injectable()
export class QuestionService {

  constructor(private RestService: RestService) {
  }

  public getQuestionsOfSpace(id): Promise<Question[]> {
    return this.RestService.getQuestions(id).toPromise().then((res) => {
      return res.json() as Question[];
    });

  }

}
