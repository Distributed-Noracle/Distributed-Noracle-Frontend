import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';

import { from, Observable } from 'rxjs';
import { KeycloakService } from 'keycloak-angular';
import { mergeMap, switchMap, tap } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {

  constructor(protected readonly keycloak: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes('/mobsos-success-modeling')) {
      return next.handle(req)
    }

    return from(this.keycloak.getToken())
      .pipe(
        tap((token) => {
          req = req.clone({
            headers: req.headers.append('access-token', `${token}`)
              .append('accept', 'application/json;q=0.9,text/plain;q=0.8,*/*;q=0.5')
              .append('content-type', 'application/json')
          });
        }),
        mergeMap(() => {
          return from(this.keycloak.loadUserProfile())
        }),
        tap((profile) => {
          req = req.clone({
            headers: req.headers.append('authorization', 'Basic ' + btoa(profile.username + ':' + this.keycloak.getKeycloakInstance().idTokenParsed.sub))
          });
        }),
        switchMap(() => {
          return next.handle(req)
        })
      )
  }
}