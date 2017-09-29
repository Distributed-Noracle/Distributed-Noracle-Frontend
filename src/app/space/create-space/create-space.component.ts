import {Component, OnInit} from '@angular/core';
import {Space} from '../../shared/rest-data-model/space';
import {SpaceService} from '../../shared/space/space.service';
import {Router} from '@angular/router';

@Component({
  selector: 'dnor-create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.css']
})
export class CreateSpaceComponent implements OnInit {

  private space = new Space();

  constructor(private spaceService: SpaceService, private router: Router) {
    this.space.name = '';
  }

  ngOnInit() {
  }

  createSpace() {
    this.spaceService.postSpace(this.space).then((space) => {
      this.router.navigate(['/spaces', space.spaceId]);
    }, );
  }

}
