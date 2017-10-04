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
    this.isAuthorizedSubscription = this.oidcSecurityService.getIsAuthorized().subscribe(
      (isAuthorized: boolean) => {
        this._isAuthorized = isAuthorized;
      });
  }

  isAuthorized() {
    return this._isAuthorized;
  }

  getLastRouteRequested() {
    const cookieValue = document.cookie.replace(/(?:(?:^|.*;\s*)rejectedPath\s*\=\s*([^;]*).*$)|^.*$/, '$1');
    document.cookie = 'rejectedPath=; expires=' + new Date(0).toUTCString();
    return cookieValue !== undefined && cookieValue.length > 0 ? JSON.parse(decodeURIComponent(cookieValue)) : undefined;
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | Observable<boolean> | Promise<boolean> {
    if (!this._isAuthorized) {
      document.cookie = 'rejectedPath=' + encodeURIComponent(JSON.stringify({
          url: route.url.map((v) => v.path).reduce((prev, cur) => prev + '/' + cur, '/'),
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
