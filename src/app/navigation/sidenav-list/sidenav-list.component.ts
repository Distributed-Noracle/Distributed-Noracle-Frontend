import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { AuthGuardService } from 'src/app/shared/auth-guard/auth-guard.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'dnor-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {

  @Output()
  public closeSidenav = new EventEmitter<void>();

  constructor(public authGuardService: AuthGuardService, public keycloak: KeycloakService) { }

  ngOnInit(): void {}

  onClose() {
    this.closeSidenav.emit();
  }

  logout() {
    if (this.authGuardService.isAuthorized) {
      this.authGuardService.logoff();
      this.keycloak.logout(environment.redirectUrl);
    }
    this.closeSidenav.emit();
  }

}
