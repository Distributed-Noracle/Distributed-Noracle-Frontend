import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {OidcSecurityService, OidcSecurityValidation} from 'angular-auth-oidc-client';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  constructor(public oidcSecurityService: OidcSecurityService) {
    if (this.oidcSecurityService.moduleSetup) {
      this.doLogin();
    } else {
      this.oidcSecurityService.onModuleSetup.subscribe(() => {
        this.doLogin();
      });
    }
  }

  ngOnInit() {
  }


  ngOnDestroy(): void {
    this.oidcSecurityService.onModuleSetup.unsubscribe();
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
  }

  private doLogin() {
    if (!window.location.hash) {
      // XXX: temporary hack to wait for well-known data to load
      setTimeout(() => {this.login(); }, 200);
    } else {
      // fixing messed up signature check in OidcSecurityValidation
      OidcSecurityValidation.prototype.getHeaderFromToken = function (token, encode) {
        let data = {};
        if (typeof token !== 'undefined') {
          const encoded = token.split('.')[0];
          if (encode) {
            return encoded;
          }
          data = JSON.parse(this.urlBase64Decode(encoded));
        }
        data['kid'] = 'rsa1';
        return data;
      };
      this.oidcSecurityService.authorizedCallback();
    }
  }
}
