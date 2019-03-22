import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {Subscription} from 'rxjs';
import {Space} from '../../shared/rest-data-model/space';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'dnor-subscribed-spaces-overview',
  templateUrl: './subscribed-spaces-overview.component.html',
  styleUrls: ['./subscribed-spaces-overview.component.css']
})
export class SubscribedSpacesOverviewComponent implements OnInit, OnDestroy {
  public spaces: { space: Space, subscription: SpaceSubscription }[];
  private spaceSubscription: Subscription;

  constructor(private myspacesService: MyspacesService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.spaceSubscription =
      this.myspacesService.getMySpacesObservable().subscribe((myspaces) => this.spaces = myspaces);
    this.myspacesService.getMySpaces().then((s) => s);
  }

  ngOnDestroy() {
    this.spaceSubscription.unsubscribe();
  }

  copyInviteUrl(myspace: { space: Space, subscription: SpaceSubscription }) {
    let url = window.location.href;
    url = url.substring(0, url.indexOf('/myspaces')) + `/spaces/${myspace.space.spaceId}?pw=${myspace.space.spaceSecret}`;
    const textArea = document.createElement('textarea');
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = '0';
    textArea.style.left = '0';
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = '0';
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';
    textArea.value = url;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        this.snackBar.open('Copied invitation link to clipboard. Paste to share with friends!', 'hide', {
          duration: 2000,
        });
      } else {
        this.copyFallback(url);
      }
    } catch (err) {
      this.copyFallback(url);
    }
    document.body.removeChild(textArea);
  }

  private copyFallback(url: string) {
    window.prompt('Could not copy to clipboard automatically. Please copy the following invitation link manually:', url);
  }

  getStringifiedParamArray(subscription: SpaceSubscription): string {
    return JSON.stringify(subscription.selectedQuestionIds);
  }

}
