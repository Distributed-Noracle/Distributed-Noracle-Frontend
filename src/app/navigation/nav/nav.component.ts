import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthGuardService} from '../../shared/auth-guard/auth-guard.service';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from 'src/app/shared/authentication/authentication.service';


@Component({
  selector: 'dnor-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Output()
  public sidenavToggle = new EventEmitter<void>();

  constructor(public authGuardService: AuthGuardService,
              public authService: AuthenticationService,
              protected readonly keycloak: KeycloakService) {
  }

  ngOnInit() {}

  logout() {
    if (this.authService.isAuthorized) {
      this.authGuardService.logoff();
      this.keycloak.logout(environment.redirectUrl);
    }
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

}
