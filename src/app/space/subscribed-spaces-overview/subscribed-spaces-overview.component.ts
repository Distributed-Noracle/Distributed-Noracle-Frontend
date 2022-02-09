import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
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
import { Splide } from '@splidejs/splide';

@Component({
  selector: 'dnor-subscribed-spaces-overview',
  templateUrl: './subscribed-spaces-overview.component.html',
  styleUrls: ['./subscribed-spaces-overview.component.css']
})
export class SubscribedSpacesOverviewComponent implements OnInit, OnDestroy, AfterViewInit {
  public mySpaces: { space: Space, subscription: SpaceSubscription }[];
  public spacesLoaded = false;
  public recommendationsLoaded = false;
  public publicSpacesLoaded = false;

  public recommenderQuestions: RecommenderQuestion[] = [];
  public publicSpaces: Space[] = [];

  private spaceSubscription: Subscription;

  private splide: Splide;

  constructor(
    private myspacesService: MyspacesService,
    private snackBar: MatSnackBar,
    private router: Router,
    private recommendationService: RecommendationService,
    private agentService: AgentService,
    private clipboard: Clipboard,
    private spaceService: SpaceService,
    private elRef: ElementRef) {}

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

        this.splide = new Splide( '.splide', {
          type   : 'loop',
          perPage: 3,
          perMove: 1,
          classes: {
            slide: 'splide__slide slide',
            prev  : 'splide__arrow--prev arrow',
            next  : 'splide__arrow--next arrow',
          },
          width: '100%'
        } );

        this.splide.mount();

        for (let rq of this.recommenderQuestions) {
          let addHTML = '<li><span id="' + rq.question.questionId + '-' + rq.question.spaceId + '">&ldquo;' + rq.question.text + '&rdquo;</span>';
          addHTML += '<i class="meta-info">asked by ' + rq.authorName + '</i>';
          addHTML += '<i class="meta-info">' + this.getDateFormat(rq.question.timestampCreated) +'</i></li>'
          this.splide.add(addHTML);
        }
      })
    });

    this.spaceService.getPublicSpaces().then((spaces: Space[]) => {
      this.publicSpaces = spaces;
    }).catch(() => {
      console.error("error while getting public spaces...");
    }).finally(() => {
      this.publicSpacesLoaded = true;
    });

    // For testing
    // this.publicSpacesLoaded = true;
    // let space = {
    //   spaceId: '12345',
    //   name: 'TestSpace Blabla',
    //   spaceOwnerId: '12345',
    //   spaceReaderGroupId: '12345',
    //   spaceSecret: '12345',
    //   private: true
    // };
    // for (let i = 0; i < 100; i++) {
    //   this.publicSpaces.push(space);
    // }
  }

  recommendationClicked(param: Node) {
    let ids: string = param.childNodes[0]['id'];
    let questionId = ids.substring(0, ids.indexOf('-'));
    let spaceId = ids.substring(ids.indexOf('-') + 1, ids.length);

    let questionIds = [];
    questionIds.push(questionId);
    let navigationExtras: NavigationExtras = {
      queryParams: {
        sq: JSON.stringify(questionIds)
      }
    }
    this.router.navigate(['/spaces', spaceId], navigationExtras);
  }

  addEventListener() {
    if (!this.recommendationsLoaded)
    {
      setTimeout(() => {
        this.addEventListener();
      }, 500);
    } else {
      let nodeList: NodeList = this.elRef.nativeElement.querySelectorAll('li');
      nodeList.forEach(n => n.addEventListener('click', () => {
        this.recommendationClicked(n);
      }));
    }
  }

  ngAfterViewInit(): void {
    this.addEventListener();
  }

  ngOnDestroy() {
    this.spaceSubscription.unsubscribe();
  }

  getDateFormat(dateString: string): string {
    let date = new Date(dateString);
    let month = date.toLocaleString('en-GB', { month: 'short' });
    return `${month}, ${date.getDay()}, ${date.getFullYear()}, ${date.getHours()}:${date.getMinutes()}`;
  }

  // recClicked(r: RecommenderQuestion): void {
  //   //let questionIds = r.questionNeighbourIds;
  //   let questionIds = [];
  //   questionIds.push(r.question.questionId);
  //   let navigationExtras: NavigationExtras = {
  //     queryParams: {
  //       sq: JSON.stringify(questionIds)
  //     }
  //   }
  //   this.router.navigate(['/spaces', r.question.spaceId], navigationExtras);
  // }

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
