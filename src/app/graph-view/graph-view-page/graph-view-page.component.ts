import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';

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

  public isEditMode = false;
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

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

}
