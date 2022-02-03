import { ComponentFactoryResolver, Injectable } from '@angular/core';
import { RecommenderQuestion } from '../rest-data-model/recommender-question';
import { RestHelperService } from '../rest-helper/rest-helper.service';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {

  // key: agentId
  // value: Recommendations
  private recommenderQuestions: Map<string, RecommenderQuestion[]> = new Map();

  constructor(private restHelperService: RestHelperService) {}

  // public getRecommendedQuestionsForSpace(agentId: string, spaceId: string): Promise<RecommenderQuestion[]> {
  //   return this.restHelperService.get(`/recommend/${agentId}/${spaceId}`);
  // }

  public getRecommendedQuestions(agentId: string, reload = false): Promise<RecommenderQuestion[]> {
    console.log(this.recommenderQuestions);
    if (this.recommenderQuestions.has(agentId) && !reload) {
      return Promise.resolve(this.recommenderQuestions.get(agentId));
    }
    return this.restHelperService.get(`/recommend/${agentId}`).then((res: RecommenderQuestion[]) => {
      this.recommenderQuestions.set(agentId, res);
      return res;
    })
  }
}
