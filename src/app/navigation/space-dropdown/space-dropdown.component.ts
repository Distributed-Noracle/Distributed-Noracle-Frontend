import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {Subscription} from 'rxjs';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';
import {Space} from '../../shared/rest-data-model/space';

@Component({
  selector: 'dnor-space-dropdown',
  templateUrl: './space-dropdown.component.html',
  styleUrls: ['./space-dropdown.component.css']
})
export class SpaceDropdownComponent implements OnInit, OnDestroy {

  public spaces: { space: Space, subscription: SpaceSubscription }[] = [];
  private spaceSubscription: Subscription;

  constructor(private myspacesService: MyspacesService) {
  }

  ngOnInit(): void {
    this.spaceSubscription = this.myspacesService.getMySpacesObservable().subscribe((myspaces) => this.spaces = myspaces);
    this.myspacesService.getMySpaces().then((s) => s);
  }

  ngOnDestroy(): void {
    this.spaceSubscription.unsubscribe();
  }

  getStringifiedParamArray(subscription: SpaceSubscription): string {
    return JSON.stringify(subscription.selectedQuestionIds);
  }

}
