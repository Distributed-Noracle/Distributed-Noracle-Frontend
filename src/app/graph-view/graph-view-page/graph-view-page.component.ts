import {Component, HostListener, OnInit} from '@angular/core';

@Component({
  selector: 'dnor-graph-view-page',
  templateUrl: './graph-view-page.component.html',
  styleUrls: ['./graph-view-page.component.css']
})
export class GraphViewPageComponent implements OnInit {
  public isEditMode = false;
  public height = 600;
  public width = 800;

  constructor() {
    this.height = (window.innerHeight - 100) * 0.9;
    this.width = window.innerWidth * 0.9;
  }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onWindowResize(event) {
    this.width = event.currentTarget.innerWidth * 0.9;
    this.height = (event.currentTarget.innerHeight - 100) * 0.9;
  }

  toggleEdit() {
    this.isEditMode = !this.isEditMode;
  }

}
