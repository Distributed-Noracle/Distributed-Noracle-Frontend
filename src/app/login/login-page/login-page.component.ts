import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {OidcSecurityService, OidcSecurityValidation} from 'angular-auth-oidc-client';

@Component({
  selector: 'dnor-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit, OnDestroy {

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

  private doLogin() {
    if (!window.location.hash) {
      // to discuss: hack to wait for well-known data to load and then redirect to oidc ID-Provider
      // setTimeout(() => {
      //   this.login();
      // }, 200);
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
