import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';
import {environment} from '../../../environments/environment';

@Injectable()
export class AgentService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getSpaceSubscriptions(): Promise<SpaceSubscription[]> {
    if (environment.mockService) {
      const s = new SpaceSubscription();
      s.name = 'Test 1';
      s.spaceId = '1';
      s.selectedQuestions = ['1'];
      return Promise.resolve([s]);
    } else {
      return this.restHelperService.getCurrentAgent().toPromise()
        .then((res) => {
          const agentId = res.json().agentid;
          return this.restHelperService.get(`/agents/${agentId}/spacesubscriptions`).toPromise()
            .then(res2 => res2.json() as SpaceSubscription[]);
        });
    }
  }

}
