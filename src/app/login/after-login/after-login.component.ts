import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AgentService} from '../../shared/agent/agent.service';
import { KeycloakService } from 'keycloak-angular';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';

@Component({
  selector: 'dnor-after-login',
  template: ''
})
export class AfterLoginComponent implements OnInit {

  constructor(authService: AuthenticationService, agentService: AgentService, router: Router, protected readonly keycloak: KeycloakService) {
    this.keycloak.isLoggedIn().then((loggedIn) => {
      if (loggedIn) {
        agentService.getAgent().then((agent) =>
        agentService.putAgentName(agent.agentid, authService.getUserName()));
        const lastRouteRequested = authService.getLastRouteRequested();
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
