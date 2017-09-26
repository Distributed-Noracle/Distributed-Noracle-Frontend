import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class AuthGuardService implements CanActivate {
  private isAuthorizedSubscription: Subscription;
  private _isAuthorized = false;

  constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {
    // XXX: we actually never unsubscribe...
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this._isAuthorized = isAuthorized;
      });
  }

  isAuthorized() {
    return this._isAuthorized;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    return this._isAuthorized;
  }

  logoff() {
    this._isAuthorized = false;
  }


}
