import { Component, OnInit } from '@angular/core';
import {AgentService} from '../../shared/agent/agent.service';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';

@Component({
  selector: 'dnor-subscribed-spaces-overview',
  templateUrl: './subscribed-spaces-overview.component.html',
  styleUrls: ['./subscribed-spaces-overview.component.css']
})
export class SubscribedSpacesOverviewComponent implements OnInit {
  private spaces: SpaceSubscription[];

  constructor(private agentService: AgentService) { }

  ngOnInit() {
    this.agentService.getSpaceSubscriptions().then((subscriptions) => this.spaces = subscriptions);
  }

}
