import {Component, OnInit} from '@angular/core';
import {Space} from '../../shared/rest-data-model/space';
import {SpaceService} from '../../shared/space/space.service';
import {Router} from '@angular/router';
import {Question} from '../../shared/rest-data-model/question';
import {QuestionService} from '../../shared/question/question.service';
import {MyspacesService} from '../../shared/myspaces/myspaces.service';

@Component({
  selector: 'dnor-create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.css']
})
export class CreateSpaceComponent {

  public space = new Space();
  public question = new Question();
  public loadingCreateSpace = false;

  public tooltipText = "If you set this space to private, only users with an invitation link are permitted to join the space."

  constructor(private spaceService: SpaceService, private questionService: QuestionService,
              private myspacesService: MyspacesService, private router: Router) {
    this.space.name = '';
    this.question.text = '';
    this.space.private = false;
  }

  createSpace(): void {
    this.loadingCreateSpace = true;
    this.spaceService.postSpace(this.space).then((space) => {
      this.questionService.postQuestion(space.spaceId, this.question).then((q) => {
        this.router.navigate(['/spaces', space.spaceId], {queryParams: {sq: JSON.stringify([q.questionId])}});
        this.myspacesService.getMySpaces().then((s) => s);
      });
    });
  }

}
