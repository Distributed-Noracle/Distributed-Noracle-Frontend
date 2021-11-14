import {Injectable} from '@angular/core';
import {AgentService} from '../agent/agent.service';
import {SpaceService} from '../space/space.service';
import {SpaceSubscription} from '../rest-data-model/spacesubscription';
import {Space} from '../rest-data-model/space';
import {Subject} from 'rxjs';
import {SpaceSubscriber} from '../rest-data-model/spacesubscriber';

@Injectable()
export class MyspacesService {
  private myspacesSubject = new Subject<{ subscription: SpaceSubscription, space: Space }[]>();
  private subscribers = new Map<string, Subject<SpaceSubscriber[]>>();

  constructor(private agentService: AgentService, private spaceService: SpaceService) {
  }

  public getMySpacesObservable(): Subject<{ subscription: SpaceSubscription, space: Space }[]> {
    return this.myspacesSubject;
  }

  public getSubscribersObservable(spaceId: string): Subject<SpaceSubscriber[]> {
    const subs = this.subscribers.get(spaceId);
    if (subs) {
      return subs;
    } else {
      this.subscribers.set(spaceId, new Subject<SpaceSubscriber[]>());
      return this.subscribers.get(spaceId);
    }
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
          })
          .catch(() => Promise.reject(null));
      })
      .catch(() => {
        return Promise.reject(null)
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

  public updateSelectionOfSubscription(spaceId: string, selection: string[]): Promise<any> {
    return this.agentService.putSelectionOfSubscription(spaceId, selection).then(() => this.getMySpaces().then((s) => s));
  }


  public getSpaceSubscribers(id): Promise<SpaceSubscriber[]> {
    return new Promise(resolve => {
      this.spaceService.getSpaceSubscribers(id).then(subs => {
        this.getSubscribersObservable(id).next(subs);
        resolve(subs);
      });
    });
  }
}
