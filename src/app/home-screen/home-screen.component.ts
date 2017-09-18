import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home-screen',
  templateUrl: './home-screen.component.html',
  styleUrls: ['./home-screen.component.css']
})
export class HomeScreenComponent implements OnInit {

  constructor(private OidcSecurityService: OidcSecurityService, private Router: Router) {
  }

  ngOnInit() {
    if (!this.OidcSecurityService.getIdToken()) {
      this.Router.navigate(['/login']);
    } else {
      this.Router.navigate(['/graph']);
    }
  }

}
