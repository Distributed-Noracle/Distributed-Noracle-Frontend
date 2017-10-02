import {Component, OnDestroy, OnInit} from '@angular/core';
import {AgentService} from '../../shared/agent/agent.service';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'dnor-subscribed-spaces-overview',
  templateUrl: './subscribed-spaces-overview.component.html',
  styleUrls: ['./subscribed-spaces-overview.component.css']
})
export class SubscribedSpacesOverviewComponent implements OnInit, OnDestroy {
  private spaces: SpaceSubscription[];
  private spaceSubscription: Subscription;

  constructor(private agentService: AgentService) {
  }

  ngOnInit() {
    this.spaceSubscription =
      this.agentService.getSpaceSubscriptionObservable().subscribe((subscriptions) => this.spaces = subscriptions);
    this.agentService.getSpaceSubscriptions().then((s) => s);
  }

  ngOnDestroy() {
    this.spaceSubscription.unsubscribe();
  }

}
