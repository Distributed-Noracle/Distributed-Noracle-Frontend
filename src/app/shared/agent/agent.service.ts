import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';

@Injectable()
export class AgentService {

  private cachedAgent;

  constructor(private restHelperService: RestHelperService) {
  }

  public getAgent(): Promise<{ agentid }> {
    if (this.cachedAgent !== undefined) {
      return Promise.resolve(this.cachedAgent);
    } else {
      return this.restHelperService.getCurrentAgent().toPromise().then((res) => {
        this.cachedAgent = res.json();
        return this.cachedAgent;
      });
    }
  }

  public getSpaceSubscriptions(): Promise<SpaceSubscription[]> {
    return this.getAgent()
      .then((agent) => {
        return this.restHelperService.get(`/agents/${agent.agentid}/spacesubscriptions`).toPromise()
          .then(res2 => res2.json() as SpaceSubscription[]);
      });
  }

  public putSelectionOfSubscription(spaceId: string, selection: string[]): Promise<any> {
    return this.getAgent().then((agent) => {
      return this.restHelperService
        .put(`/agents/${agent.agentid}/spacesubscriptions/${spaceId}/selectedQuestions`,
          {selectedQuestions: selection}).toPromise()
        .then((res) => {
          return res;
        });
    });
  }
}
