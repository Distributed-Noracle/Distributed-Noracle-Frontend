import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {OidcSecurityService} from 'angular-auth-oidc-client';

@Injectable()
export class AuthGuardService implements CanActivate {
  private isAuthorizedSubscription: Subscription;
  private _isAuthorized = false;
  private userDataSubscription: Subscription;
  private userData: any;

  constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this._isAuthorized = isAuthorized;
      });
    this.userDataSubscription = this.oidcSecurityService.getUserData().subscribe(userData => this.userData = userData);
  }

  isAuthorized() {
    return this._isAuthorized;
  }

  getUserData(): { preferred_username} {
    return this.userData;
  }

  getLastRouteRequested() {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)rejectedPath\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    document.cookie = 'rejectedPath=; expires=' + new Date(0).toUTCString();
    return cookieValue !== undefined && cookieValue.length > 0 ? JSON.parse(decodeURIComponent(cookieValue)) : undefined;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (!this._isAuthorized) {
      document.cookie = 'rejectedPath=' + encodeURIComponent(JSON.stringify({
          url: route.url.map((v) => v.path).reduce((prev, cur) => prev + '/' + cur, ''),
          queryParams: route.queryParams
        })) + '; path=/; expires=' + new Date(Date.now() + ((3 * 60 * 1000))).toUTCString();
      this.router.navigate(['/login'], {replaceUrl: true});
    }
    return this._isAuthorized;
  }

  logoff() {
    this._isAuthorized = false;
  }


}
