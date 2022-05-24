import {ChangeDetectorRef, Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {GraphInteractionMode} from '../graph-view/graph-data-model/graph-interaction-mode.enum';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { Subscription}  from 'rxjs';
import { MyspacesService } from '../../shared/myspaces/myspaces.service';
import { GraphViewService } from '../graph-view/graph-view.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';
import { SpaceService } from 'src/app/shared/space/space.service';
import { Space } from 'src/app/shared/rest-data-model/space';
import { RecommendationService } from 'src/app/shared/recommendation/recommendation.service';
import { RecommenderQuestion } from 'src/app/shared/rest-data-model/recommender-question';
import { AgentService } from 'src/app/shared/agent/agent.service';

@Component({
  selector: 'dnor-graph-view-page',
  templateUrl: './graph-view-page.component.html',
  styleUrls: ['./graph-view-page.component.css']
})
export class GraphViewPageComponent implements OnInit, OnDestroy, OnChanges {
  public subscriptionInProgress = false;
  public interactionMode = GraphInteractionMode.SelectAndNavigate;
  public height = 800;
  public width = 1100;
  public spaceId = '1';
  public space: Space;
  public selectedQuestions;
  public spaceMembers = [];
  public loading = false;
  public recommenderQuestions: RecommenderQuestion[] = [];
  public selectedRecommenderQuestion: [];
  public recommendationsLoaded = false;

  private subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private ref: ChangeDetectorRef,
    private myspacesService: MyspacesService,
    private graphViewService: GraphViewService,
    private snackBar: MatSnackBar,
    private clipboard: Clipboard,
    private spaceService: SpaceService,
    private recommendationService: RecommendationService,
    private agentService: AgentService) {}

  ngOnChanges(changes: SimpleChanges): void {}

  copyInviteUrl() {
    let url = window.location.href;
    url = url.substring(0, url.indexOf('/spaces')) + `/spaces/${this.space.spaceId}?pw=${this.space.spaceSecret}`;
    this.clipboard.copy(url);
    this.snackBar.open('Copied invitation link to clipboard. Paste to share with friends!', 'Ok', {
      duration: 5000
    });
  }

  ngOnInit() {
    // TODO: This can be done way easier!
    this.subscription.add(this.activatedRoute.params.subscribe((params) => {
      this.spaceId = params['spaceId'];
      this.myspacesService.getSubscribersObservable(this.spaceId).subscribe(subs => {
        this.spaceMembers = subs.map(sub => sub.name);
      });
      this.myspacesService.getMySpaces().then(res => {
        if (res.find(s => s.space.spaceId === this.spaceId)) {
          this.spaceService.getSpace(this.spaceId).then((space: Space) => {
            this.space = space;
          });
        }
      });
    }));
    this.subscription.add(this.activatedRoute.queryParams.subscribe((queryParams) => {
      const pw = queryParams['pw'];
      if (pw !== undefined) {
        this.subscriptionInProgress = true;
        this.myspacesService.subscribeToSpace(this.spaceId, pw).then((res) => {
          this.space = res?.space;
          const qp = queryParams['sq'] !== undefined ? {sq: queryParams['sq']} : {};
          this.router.navigate([], {queryParams: qp, replaceUrl: true}).then(() => {
            this.subscriptionInProgress = false
            this.loadRecommendations().then(() => {
              this.ngOnInit(); // reload component
            })
          });
        });
      }
      const q = queryParams['sq'];
      if (q === undefined) {
        this.selectedQuestions = [];
      } else {
        this.selectedQuestions = JSON.parse(q);
      }
    }));
    this.width = window.innerWidth * 0.99;
    this.height = window.innerHeight * 0.92;

    this.subscription.add(this.graphViewService.loading.subscribe((loading) => {
      this.loading = loading;
      this.ref.detectChanges();
    }));

    this.loadRecommendations();
  }

  loadRecommendations(): Promise<any> {
    if (this.recommenderQuestions.length > 0) {
      return;
    }
    this.recommendationsLoaded = false;
    return this.agentService.getAgent().then((agent) => {
      return this.recommendationService.getRecommendedQuestionsForSpace(agent.agentid, this.spaceId)
        .then((res: RecommenderQuestion[]) => {
        this.recommenderQuestions = res;
      }).catch(() => {
        console.error("error while getting recommendations...");
      }).finally(() => {
        this.recommendationsLoaded = true;
      })
    });
  }

  recClicked(rq: RecommenderQuestion): void {
    //let questionIds = r.questionNeighbourIds;
    let questionIds = [];
    questionIds.push(rq.question.questionId);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        sq: JSON.stringify(questionIds)
      }
    }
    this.graphViewService.recommenderSubject.next(questionIds);
    this.router.navigate(['/spaces', rq.question.spaceId], navigationExtras);
  }

  GetPastTime(rq: RecommenderQuestion): string {
    // TODO: This is way to complicated!
    let date = new Date(rq.question.timestampCreated);
    let dateNow = new Date();

    if (date.getFullYear() === dateNow.getFullYear()) {
      if (date.getMonth() === dateNow.getMonth()) {
        if (date.getDate() === dateNow.getDate()) {
          if (date.getHours() === dateNow.getHours()) {
            if (date.getMinutes() === dateNow.getMinutes()) {
              // show seconds
              return (dateNow.getSeconds() - date.getSeconds()) + ' second(s) ago';
            } else {
              // show minutes
              return (dateNow.getMinutes() - date.getMinutes()) + ' minute(s) ago';
            }
          } else {
            // show hours
            return (dateNow.getHours() - date.getHours()) + ' hour(s) ago';
          }
        } else {
          // show days
          return (dateNow.getDate() - date.getDate()) + ' day(s) ago';
        }
      } else {
        // show month
        return (dateNow.getMonth() - date.getMonth()) + ' month(s) ago';
      }
    } else {
      // show years
      // year change
      if (dateNow.getFullYear() - date.getFullYear() === 1) {
        // show month
        return (12 - date.getMonth() + date.getMonth()) + ' month(s) ago';
      }
      return (dateNow.getFullYear() - date.getFullYear()) + 'year(s) ago';
    }
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public getInteractionModes() {
    const modes = [];
    for (const mode in GraphInteractionMode) {
      if (typeof GraphInteractionMode[mode] === 'number') {
        modes.push(GraphInteractionMode[mode]);
      }
    }
    return modes;
  }

  public getInteractionModeLabel(mode: number) {
    switch (GraphInteractionMode[mode]) {
      case 'SelectAndNavigate':
        return 'Select/Navigate';
      case 'DragAndZoom':
        return 'Drag/Zoom';
      case 'AddQuestion':
        return 'Add Question';
      case 'AddRelation':
        return 'Add Relation';
      case 'Inspect':
        return 'Vote/Edit';
    }
  }
}
