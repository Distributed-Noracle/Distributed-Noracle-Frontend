import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';

@Injectable()
export class AgentService {

  private cachedAgent;
  private cachedAgentNames: Map<string, string> = new Map<string, string>();

  constructor(private restHelperService: RestHelperService) {
  }

  public getAgent(): Promise<{ agentid: string }> {
    if (this.cachedAgent !== undefined) {
      return Promise.resolve(this.cachedAgent);
    } else {
      return this.restHelperService.getCurrentAgent().then((res) => {
        this.cachedAgent = res.json();
        return this.cachedAgent;
      });
    }
  }

  public putAgentName(agentId: string, name: string): Promise<string> {
    this.cachedAgentNames.set(agentId, name);
    return this.restHelperService.put(`/agents/${agentId}`, {agentName: name})
      .then((res) => res.json().name as string);
  }

  public getAgentName(agentId: string): Promise<string> {
    if (this.cachedAgentNames.has(agentId)) {
      return Promise.resolve(this.cachedAgentNames.get(agentId));
    } else {
      return this.restHelperService.get(`/agents/${agentId}`).then(res => {
        this.cachedAgentNames.set(agentId, res.json().name);
        return res.json().name as string;
      }, reason => 'unknown');
    }
  }

  public getSpaceSubscriptions(): Promise<SpaceSubscription[]> {
    return this.getAgent()
      .then((agent) => {
        return this.restHelperService.get(`/agents/${agent.agentid}/spacesubscriptions`)
          .then(res2 => res2.json() as SpaceSubscription[]);
      });
  }

  public postSpaceSubscription(postData: { spaceId: string, spaceSecret: string }): Promise<SpaceSubscription> {
    return this.getAgent()
      .then((agent) => {
        return this.restHelperService.post(`/agents/${agent.agentid}/spacesubscriptions`, postData)
          .then(res => {
            return this.restHelperService.getAbsoulte(res.headers.get('location'))
              .then((res2) => res2.json() as SpaceSubscription);
          });
      });
  }

  public putSelectionOfSubscription(spaceId: string, selection: string[]): Promise<any> {
    return this.getAgent().then((agent) => {
      return this.restHelperService
        .put(`/agents/${agent.agentid}/spacesubscriptions/${spaceId}/selectedQuestions`,
          {selectedQuestions: selection})
        .then((res) => {
          return res;
        });
    });
  }
}
