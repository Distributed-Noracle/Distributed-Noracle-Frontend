import {Component,  OnInit} from '@angular/core';
// import {OidcSecurityService, TokenHelperService} from 'angular-auth-oidc-client';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import {take, filter} from 'rxjs/operators';

@Component({
  selector: 'dnor-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  private keycloakLoginOptions: KeycloakLoginOptions = {
    redirectUri: 'http://localhost:4200/welcome'
  }

  constructor(protected readonly keycloak: KeycloakService,) {
    // this.oidcSecurityService.getIsModuleSetup().pipe(
    //   filter((isModuleSetup: boolean) => isModuleSetup),
    //   take(1)
    // ).subscribe((isModuleSetup: boolean) => {
    //   this.doLogin();
    // });

  }

  ngOnInit() {
  }

  login() {


    this.keycloak.login(this.keycloakLoginOptions);
    // this.oidcSecurityService.authorize();
  }

  // private doLogin() {
  //   if (!window.location.hash) {
  //     // to discuss: hack to wait for well-known data to load and then redirect to oidc ID-Provider
  //     // setTimeout(() => {
  //     //   this.login();
  //     // }, 200);
  //   } else {
  //     // fixing messed up signature check in OidcSecurityValidation
  //     TokenHelperService.prototype.getHeaderFromToken = function (token, encode) {
  //       let data = {};
  //       if (typeof token !== 'undefined') {
  //         const encoded = token.split('.')[0];
  //         if (encode) {
  //           return encoded;
  //         }
  //         data = JSON.parse(this.urlBase64Decode(encoded));
  //       }
  //       data['kid'] = 'rsa1';
  //       return data;
  //     };
  //     this.oidcSecurityService.authorizedImplicitFlowCallback();
  //   }
  // }
}
