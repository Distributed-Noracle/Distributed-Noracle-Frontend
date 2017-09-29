import {Component, OnInit} from '@angular/core';
import {SpaceSubscription} from '../../shared/rest-data-model/spacesubscription';

@Component({
  selector: 'dnor-space-dropdown',
  templateUrl: './space-dropdown.component.html',
  styleUrls: ['./space-dropdown.component.css']
})
export class SpaceDropdownComponent implements OnInit {

  private spaces: SpaceSubscription[] = [];

  constructor() {
  }

  ngOnInit() {
    const s = new SpaceSubscription();
    s.name = 'Test 1';
    s.spaceId = '1';
    s.selectedQuestions = ['1'];
    this.spaces.push(s);
  }

}
