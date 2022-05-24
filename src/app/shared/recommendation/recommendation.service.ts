import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { RecommenderQuestion } from '../rest-data-model/recommender-question';
import { RestHelperService } from '../rest-helper/rest-helper.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  constructor(private restHelperService: RestHelperService) {}

  public getRecommendedQuestionsForSpace(agentId: string, spaceId: string): Promise<RecommenderQuestion[]> {
    return this.restHelperService.get(`/recommend/${agentId}/${spaceId}`);
  }

  public getRecommendedQuestions(agentId: string): Promise<RecommenderQuestion[]> {
    return this.restHelperService.get(`/recommend/${agentId}`);
  }
}
