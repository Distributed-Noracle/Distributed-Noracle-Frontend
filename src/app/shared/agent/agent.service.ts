import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';

@Injectable()
export class AgentService {

  constructor(private restHelperService: RestHelperService) {
  }

  public getSpaceSubscriptions(): Promise<SpaceSubscription[]> {
    return this.restHelperService.getCurrentAgent().toPromise()
      .then((res) => {
        const agentId = res.json().agentid;
        return this.restHelperService.get(`/agents/${agentId}/spacesubscriptions`).toPromise()
          .then(res2 => res2.json() as SpaceSubscription[]);
      });
  }

}
