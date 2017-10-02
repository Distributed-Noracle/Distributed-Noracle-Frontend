import {Injectable} from '@angular/core';
import {RestHelperService} from '../rest-helper/rest-helper.service';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AgentService {

  private subscriptionObservable: Subject<SpaceSubscription[]>;

  constructor(private restHelperService: RestHelperService) {
    this.subscriptionObservable = new Subject<SpaceSubscription[]>();
  }

  public getSpaceSubscriptionObservable(): Observable<SpaceSubscription[]> {
    return this.subscriptionObservable;
  }

  public getSpaceSubscriptions(): Promise<SpaceSubscription[]> {
    return this.restHelperService.getCurrentAgent().toPromise()
      .then((res) => {
        const agentId = res.json().agentid;
        return this.restHelperService.get(`/agents/${agentId}/spacesubscriptions`).toPromise()
          .then(res2 => res2.json() as SpaceSubscription[]);
      }).then((subscriptions) => {
        const dummySubscription = new SpaceSubscription();
        dummySubscription.spaceId = 'dummy';
        dummySubscription.selectedQuestions = ['1'];
        dummySubscription.name = 'Dummy Subscription';
        subscriptions.push(dummySubscription);
        this.subscriptionObservable.next(subscriptions);
        return subscriptions;
      });
  }

}
