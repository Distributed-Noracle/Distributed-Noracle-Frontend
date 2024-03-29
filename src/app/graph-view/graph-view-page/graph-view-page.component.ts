import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {GraphInteractionMode} from '../graph-view/graph-data-model/graph-interaction-mode.enum';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';

@Component({
  selector: 'dnor-graph-view-page',
  templateUrl: './graph-view-page.component.html',
  styleUrls: ['./graph-view-page.component.css']
})
export class GraphViewPageComponent implements OnInit, OnDestroy {
  public subscriptionInProgress = false;
  public interactionMode = GraphInteractionMode.SelectAndNavigate;
  public height = 800;
  public width = 1100;
  private paramSubscription: Subscription;
  private queryParamSubscription: Subscription;
  public spaceId = '1';
  public selectedQuestions;
  public spaceMembers = [];

  // private adjustSize() {
  //   this.height = (window.innerHeight
  //     - this.graphContainer.nativeElement.getBoundingClientRect().top
  //     - this.below.nativeElement.getBoundingClientRect().height) * 0.9;
  //   this.width = window.innerWidth * 0.95;
  // }

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private myspacesService: MyspacesService) {}

  ngOnInit() {
    this.paramSubscription = this.activatedRoute.params.subscribe((params) => {
      this.spaceId = params['spaceId'];
      this.myspacesService.getSubscribersObservable(this.spaceId).subscribe(subs => {
        this.spaceMembers = subs.map(sub => sub.name);
      });
    });
    this.queryParamSubscription = this.activatedRoute.queryParams.subscribe((queryParams) => {
      const pw = queryParams['pw'];
      if (pw !== undefined) {
        this.subscriptionInProgress = true;
        this.myspacesService.subscribeToSpace(this.spaceId, pw).then(() => {
          const qp = queryParams['sq'] !== undefined ? {sq: queryParams['sq']} : {};
          this.router.navigate([], {queryParams: qp, replaceUrl: true}).then(() =>
            this.subscriptionInProgress = false
          );
        });

      }
      const q = queryParams['sq'];
      if (q === undefined) {
        this.selectedQuestions = [];
      } else {
        this.selectedQuestions = JSON.parse(q);
      }
    });
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.queryParamSubscription.unsubscribe();
  }

  // @HostListener('window:resize', ['$event'])
  // onWindowResize(event) {
  //   this.adjustSize();
  // }
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
