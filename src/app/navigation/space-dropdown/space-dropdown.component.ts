import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {AgentService} from '../../shared/agent/agent.service';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'dnor-space-dropdown',
  templateUrl: './space-dropdown.component.html',
  styleUrls: ['./space-dropdown.component.css']
})
export class SpaceDropdownComponent implements OnInit, OnDestroy {

  private spaces: SpaceSubscription[] = [];
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
