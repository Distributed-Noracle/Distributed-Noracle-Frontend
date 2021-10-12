import { Component, OnInit } from '@angular/core';
import { AuthGuardService } from 'src/app/shared/auth-guard/auth-guard.service';

@Component({
  selector: 'dnor-login',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
// TODO: Kann diese Komponente komplett entfallen?
// Wenn wir beim Login sowieso immer direkt versuchen uns mit Keycloak
// bei Learning Layers zu authentifizieren, werden wir nie das Template
// dieser Komponente anzeigen.
export class LoginPageComponent implements OnInit {
  constructor(private authGuardService: AuthGuardService) {
    this.authGuardService.login();
  }

  ngOnInit() {}

  login() {
    this.authGuardService.login();
  }
}
