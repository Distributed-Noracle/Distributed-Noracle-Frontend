import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SpaceService} from './space/space.service';
import {QuestionService} from './question/question.service';
import {RelationService} from './relation/relation.service';
import {AgentService} from './agent/agent.service';
import {RestHelperService} from './rest-helper/rest-helper.service';
import {AuthGuardService} from './auth-guard/auth-guard.service';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {MyspacesService} from './myspaces/myspaces.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [],
  providers: [SpaceService, QuestionService, RelationService, AgentService,
    RestHelperService, OidcSecurityService, AuthGuardService, MyspacesService]
})
export class SharedModule {
}
