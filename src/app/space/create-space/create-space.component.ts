import {Component, OnInit} from '@angular/core';
import {Space} from '../../shared/rest-data-model/space';
import {SpaceService} from '../../shared/space/space.service';
import {Router} from '@angular/router';
import {Question} from '../../shared/rest-data-model/question';
import {QuestionService} from '../../shared/question/question.service';
import {AgentService} from '../../shared/agent/agent.service';

@Component({
  selector: 'dnor-create-space',
  templateUrl: './create-space.component.html',
  styleUrls: ['./create-space.component.css']
})
export class CreateSpaceComponent implements OnInit {

  private space = new Space();
  private question = new Question();

  constructor(private spaceService: SpaceService, private questionService: QuestionService,
              private agentService: AgentService, private router: Router) {
    this.space.name = '';
    this.question.text = '';
  }

  ngOnInit() {
  }

  createSpace() {
    this.spaceService.postSpace(this.space).then((space) => {
      this.questionService.postQuestion(space.spaceId, this.question).then((q) => {
        this.router.navigate(['/spaces', space.spaceId], {queryParams: {sq: q.questionId}});
        this.agentService.getSpaceSubscriptions().then((s) => s);
      });
    });
  }

}
