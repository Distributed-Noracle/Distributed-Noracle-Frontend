import {Component, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {AgentService} from '../../shared/agent/agent.service';

@Component({
  selector: 'dnor-space-dropdown',
  templateUrl: './space-dropdown.component.html',
  styleUrls: ['./space-dropdown.component.css']
})
export class SpaceDropdownComponent implements OnInit {

  private spaces: SpaceSubscription[] = [];

  constructor(private agentService: AgentService) {
  }

  ngOnInit() {
    this.agentService.getSpaceSubscriptions().then((subscriptions) => subscriptions.forEach(s => this.spaces.push(s)));
  }

}
