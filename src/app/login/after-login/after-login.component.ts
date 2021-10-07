import {Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../../shared/auth-guard/auth-guard.service';
import {Router} from '@angular/router';
import {AgentService} from '../../shared/agent/agent.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'dnor-after-login',
  template: ''
})
export class AfterLoginComponent implements OnInit {

  constructor(authGuardService: AuthGuardService, agentService: AgentService, router: Router, protected readonly keycloak: KeycloakService) {
    this.keycloak.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        agentService.getAgent().then((agent) =>
        agentService.putAgentName(agent.agentid, authGuardService.getUserName()));
        const lastRouteRequested = authGuardService.getLastRouteRequested();
        if (lastRouteRequested !== undefined) {
          router.navigate([lastRouteRequested.url], {
            queryParams: lastRouteRequested.queryParams,
            replaceUrl: true
          });
        } else {
        router.navigate(['/myspaces'], {replaceUrl: true});
        }
      } else {
        router.navigate(['/welcome'], {replaceUrl: true});
      }
    });
  }

  ngOnInit() {
  }

}
