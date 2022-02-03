import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpaceService} from './space/space.service';
import {QuestionService} from './question/question.service';
import {RelationService} from './relation/relation.service';
import {AgentService} from './agent/agent.service';
import {RestHelperService} from './rest-helper/rest-helper.service';
import {AuthGuardService} from './auth-guard/auth-guard.service';
import {MyspacesService} from './myspaces/myspaces.service';
import { RelationVoteService } from './relation-vote/relation-vote.service';
import {QuestionVoteService} from './question-vote/question-vote.service';
import {RecommendationService} from './recommendation/recommendation.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [
    SpaceService,
    QuestionService,
    RelationService,
    AgentService,
    RestHelperService,
    AuthGuardService,
    MyspacesService,
    QuestionVoteService,
    RelationVoteService,
    RecommendationService,
  ]
})
export class SharedModule {
}
