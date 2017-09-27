import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {GraphInteractionMode} from '../graph-view/graph-data-model/graph-interaction-mode.enum';

@Component({
  selector: 'dnor-graph-view-page',
  templateUrl: './graph-view-page.component.html',
  styleUrls: ['./graph-view-page.component.css']
})
export class GraphViewPageComponent implements OnInit {
  @ViewChild('graphContainer')
  private graphContainer;
  @ViewChild('below')
  private below;
  private elementRef: ElementRef;

  public interactionMode = GraphInteractionMode.SelectAndNavigate;
  public height = 600;
  public width = 800;

  private adjustSize() {
    this.height = (window.innerHeight
      - this.graphContainer.nativeElement.getBoundingClientRect().top
      - this.below.nativeElement.getBoundingClientRect().height) * 0.9;
    this.width = window.innerWidth * 0.9;
  }

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngOnInit() {
    this.adjustSize();
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
