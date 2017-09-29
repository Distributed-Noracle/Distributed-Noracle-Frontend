import { Injectable } from '@angular/core';
import {Question} from '../rest-data-model/question';
import {RestHelperService} from '../rest-helper/rest-helper.service';

@Injectable()
export class QuestionService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getQuestionsOfSpace(id): Promise<Question[]> {
    return this.restHelperService.get(`/spaces/${id}/questions`).toPromise().then((res) => {
      return res.json() as Question[];
    });
  }

}
