import {Component,  OnInit} from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakLoginOptions } from 'keycloak-js';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'dnor-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {

  private keycloakLoginOptions: KeycloakLoginOptions = {
    redirectUri: environment.redirectUrl
  }

  constructor(protected readonly keycloak: KeycloakService) {}

  ngOnInit() {
  }

  login() {
    this.keycloak.login(this.keycloakLoginOptions);
  }
}
