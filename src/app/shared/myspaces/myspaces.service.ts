import {Injectable} from '@angular/core';
import {AgentService} from '../agent/agent.service';
import {SpaceService} from '../space/space.service';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';
import {Space} from '../rest-data-model/space';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class MyspacesService {
  private myspacesSubject = new Subject<{ subscription: SpaceSubscription, space: Space }[]>();

  constructor(private agentService: AgentService, private spaceService: SpaceService) {
  }

  public getMySpacesObservable(): Observable<{ subscription: SpaceSubscription, space: Space }[]> {
    return this.myspacesSubject;
  }

  public getMySpaces(): Promise<{ subscription: SpaceSubscription, space: Space }[]> {
    return this.agentService.getSpaceSubscriptions()
      .then((subscriptions) => {
        return Promise.all(subscriptions.map((subscription) => this.spaceService.getSpace(subscription.spaceId)))
          .then((values) => {
            const result: { subscription: SpaceSubscription, space: Space }[] = [];
            subscriptions.forEach((subscription) => {
              const space = values.find((val) => val.spaceId === subscription.spaceId);
              result.push({space: space, subscription: subscription});
            });
            const dummySubscription = new SpaceSubscription();
            const dummySpace = new Space();
            dummySpace.spaceId = dummySubscription.spaceId = 'dummy';
            dummySubscription.selectedQuestions = ['1'];
            dummySpace.name = 'Dummy Subscription';
            dummySpace.spaceSecret = 'dummypassword';
            result.push({space: dummySpace, subscription: dummySubscription});
            this.myspacesSubject.next(result);
            return result;
          });
      });
  }

}
