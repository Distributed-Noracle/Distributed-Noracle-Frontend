import {Component, OnInit} from '@angular/core';
import {AuthGuardService} from '../../shared/auth-guard/auth-guard.service';
import {Router} from '@angular/router';

@Component({
  selector: 'dnor-after-login',
  template: ''
})
export class AfterLoginComponent implements OnInit {

  constructor(authGuardService: AuthGuardService, router: Router) {
    if (authGuardService.isAuthorized()) {
      const lastRouteRequested = authGuardService.getLastRouteRequested();
      if (lastRouteRequested !== undefined) {
        router.navigateByUrl(lastRouteRequested.url, {
          queryParams: lastRouteRequested.queryParams,
          replaceUrl: true
        });
      } else {
        router.navigate(['/myspaces'], {replaceUrl: true});
      }
    } else {
      router.navigate(['/welcome'], {replaceUrl: true});
    }
  }

  ngOnInit() {
  }

}
