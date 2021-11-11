import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {AuthGuardService} from '../../shared/auth-guard/auth-guard.service';
import { KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'dnor-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  @Output()
  public sidenavToggle = new EventEmitter<void>();

  constructor(public authGuardService: AuthGuardService,
              protected readonly keycloak: KeycloakService) {
  }

  ngOnInit() {}

  logout() {
    if (this.authGuardService.isAuthorized) {
      this.authGuardService.logoff();
      this.keycloak.logout(environment.redirectUrl);
    }
  }

  onToggleSidenav(): void {
    this.sidenavToggle.emit();
  }

}
