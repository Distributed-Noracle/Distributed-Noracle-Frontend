import {Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GraphInteractionMode} from '../graph-view/graph-data-model/graph-interaction-mode.enum';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'dnor-graph-view-page',
  templateUrl: './graph-view-page.component.html',
  styleUrls: ['./graph-view-page.component.css']
})
export class GraphViewPageComponent implements OnInit, OnDestroy {
  @ViewChild('graphContainer')
  private graphContainer;
  @ViewChild('below')
  private below;
  private elementRef: ElementRef;

  private interactionMode = GraphInteractionMode.SelectAndNavigate;
  private height = 600;
  private width = 800;
  private paramSubscription: Subscription;
  private queryParamSubscription: Subscription;
  private spaceId = '1';
  private selectedQuestions;

  private adjustSize() {
    this.height = (window.innerHeight
      - this.graphContainer.nativeElement.getBoundingClientRect().top
      - this.below.nativeElement.getBoundingClientRect().height) * 0.9;
    this.width = window.innerWidth * 0.9;
  }

  constructor(elementRef: ElementRef, private activatedRoute: ActivatedRoute) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.paramSubscription = this.activatedRoute.params.subscribe((params) => {
      this.spaceId = params['spaceId'];
    });
    this.queryParamSubscription =  this.activatedRoute.queryParams.subscribe((queryParams) => {
      const q = queryParams['sq'];
      this.selectedQuestions = typeof(q) === 'string' ? [q] : q;
    });
    this.adjustSize();
  }

  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.queryParamSubscription.unsubscribe();
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.adjustSize();
  }

  private getInteractionModes() {
    const modes = [];
    for (const mode in GraphInteractionMode) {
      if (typeof GraphInteractionMode[mode] === 'number') {
        modes.push(GraphInteractionMode[mode]);
      }
    }
    return modes;
  }

  private getInteractionModeLabel(mode: number) {
    return GraphInteractionMode[mode];
  }
}
