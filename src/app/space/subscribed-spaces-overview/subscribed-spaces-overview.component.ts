import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {Subscription} from 'rxjs/Subscription';
import {Space} from '../../shared/rest-data-model/space';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';

@Component({
  selector: 'dnor-subscribed-spaces-overview',
  templateUrl: './subscribed-spaces-overview.component.html',
  styleUrls: ['./subscribed-spaces-overview.component.css']
})
export class SubscribedSpacesOverviewComponent implements OnInit, OnDestroy {
  private spaces: {space: Space, subscription: SpaceSubscription}[];
  private spaceSubscription: Subscription;

  constructor(private myspacesService: MyspacesService) {
  }

  ngOnInit() {
    this.spaceSubscription =
      this.myspacesService.getMySpacesObservable().subscribe((myspaces) => this.spaces = myspaces);
    this.myspacesService.getMySpaces().then((s) => s);
  }

  ngOnDestroy() {
    this.spaceSubscription.unsubscribe();
  }

}
