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
            this.myspacesSubject.next(result);
            return result;
          });
      });
  }

  public subscribeToSpace(spaceId: string, secret: string): Promise<{ subscription: SpaceSubscription, space: Space }> {
    return this.getMySpaces().then((ms) => {
      const index = ms.findIndex((s) => s.subscription.spaceId === spaceId);
      if (index === -1) {
        this.agentService.postSpaceSubscription({spaceId: spaceId, spaceSecret: secret})
          .then((subscription) => {
            return this.getMySpaces().then(ms2 => ms2.find((s) => s.subscription.spaceId === spaceId));
          });
      } else {
        return Promise.resolve(ms[index]);
      }
    });
  }

  public updateSelectionOfSubscription(spaceId: string, selection: string[]) {
    this.agentService.putSelectionOfSubscription(spaceId, selection).then(() => this.getMySpaces().then((s) => s));
  }

}
