import {Component, OnDestroy, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';
import {Subscription} from 'rxjs';
import {Space} from '../../shared/rest-data-model/space';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import { RecommenderQuestion } from 'src/app/shared/rest-data-model/recommender-question';
import { NavigationExtras, Router } from '@angular/router';
import { RecommendationService } from 'src/app/shared/recommendation/recommendation.service';
import { AgentService } from 'src/app/shared/agent/agent.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { SpaceService } from 'src/app/shared/space/space.service';

@Component({
  selector: 'dnor-subscribed-spaces-overview',
  templateUrl: './subscribed-spaces-overview.component.html',
  styleUrls: ['./subscribed-spaces-overview.component.css']
})
export class SubscribedSpacesOverviewComponent implements OnInit, OnDestroy {
  public mySpaces: { space: Space, subscription: SpaceSubscription }[];
  public spacesLoaded = false;
  public recommendationsLoaded = false;
  public recommenderQuestions: RecommenderQuestion[] = [];
  public publicSpaces: Space[] = [];

  private spaceSubscription: Subscription;

  constructor(private myspacesService: MyspacesService, private snackBar: MatSnackBar, private router: Router, private recommendationService: RecommendationService,
              private agentService: AgentService, private clipboard: Clipboard, private spaceService: SpaceService) {
  }

  getDateFormat(dateString: string): string {
    let date = new Date(dateString);
    let month = date.toLocaleString('en-GB', { month: 'short' });
    return `${month}, ${date.getDay()}, ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
  }

  ngOnInit() {
    this.spaceSubscription = this.myspacesService.getMySpacesObservable().subscribe((myspaces) => {
      this.spacesLoaded = true;
      this.mySpaces = myspaces
    });

    this.myspacesService.getMySpaces().then((s) => s);

    this.agentService.getAgent().then((agent) => {
      this.recommendationService.getRecommendedQuestions(agent.agentid)
        .then((res: RecommenderQuestion[]) => {
        this.recommenderQuestions = res;
      }).catch(() => {
        console.error("error while getting recommendations...");
      }).finally(() => {
        this.recommendationsLoaded = true;
      })
    });

    this.spaceService.getPublicSpaces().then((spaces: Space[]) => {
      this.publicSpaces = spaces;
    });
  }

  ngOnDestroy() {
    this.spaceSubscription.unsubscribe();
  }

  recClicked(r: RecommenderQuestion): void {
    //let questionIds = r.questionNeighbourIds;
    let questionIds = [];
    questionIds.push(r.question.questionId);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        sq: JSON.stringify(questionIds)
      }
    }
    this.router.navigate(['/spaces', r.question.spaceId], navigationExtras);
  }

  publicSpaceClicked(s: Space): void {
    // this.router.navigate(['/spaces', space.spaceId], {queryParams: {sq: JSON.stringify([q.questionId])}});
    this.router.navigate(['/spaces', s.spaceId], {queryParams: {pw: s.spaceSecret}});
  }

  copyInviteUrl(myspace: { space: Space, subscription: SpaceSubscription }) {
    let url = window.location.href;
    url = url.substring(0, url.indexOf('/myspaces')) + `/spaces/${myspace.space.spaceId}?pw=${myspace.space.spaceSecret}`;
    this.clipboard.copy(url);
    this.snackBar.open('Copied invitation link to clipboard. Paste to share with friends!', 'Ok');
  }

  getStringifiedParamArray(subscription: SpaceSubscription): string {
    return JSON.stringify(subscription.selectedQuestionIds);
  }

}
