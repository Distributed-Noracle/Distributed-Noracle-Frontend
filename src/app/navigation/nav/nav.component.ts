import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {AuthGuardService} from '../../shared/auth-guard/auth-guard.service';
import {Router} from '@angular/router';


@Component({
  selector: 'dnor-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(private oidcSecurityService: OidcSecurityService, public authGuardService: AuthGuardService,
              private router: Router) {
  }

  ngOnInit() {
  }

  logout() {
    this.authGuardService.isAuthorized();
    {
      this.oidcSecurityService.logoff();
      this.authGuardService.logoff();
      // XXX: hack because we don't support end session
      const windowref = window.open('https://api.learning-layers.eu/o/oauth2/logout', '', '_blank');
      setTimeout(() => { windowref.close(); }, 500);
      this.router.navigate(['login']);
    }
  }

}
