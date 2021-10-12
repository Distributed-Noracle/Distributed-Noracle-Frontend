import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppComponent} from './app.component';
import {GraphViewModule} from './graph-view/graph-view.module';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthGuardService} from './shared/auth-guard/auth-guard.service';
import {NavigationModule} from './navigation/navigation.module';
import {SharedModule} from './shared/shared.module';
import {LoginModule} from './login/login.module';
import {LoginPageComponent} from './login/login-page/login-page.component';
import {GraphViewPageComponent} from './graph-view/graph-view-page/graph-view-page.component';
import {WelcomePageComponent} from './login/welcome-page/welcome-page.component';
import {SpaceModule} from './space/space.module';
import {SubscribedSpacesOverviewComponent} from './space/subscribed-spaces-overview/subscribed-spaces-overview.component';
import {CreateSpaceComponent} from './space/create-space/create-space.component';
import {AfterLoginComponent} from './login/after-login/after-login.component';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';

import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { environment } from 'src/environments/environment';
import { HttpRequestInterceptor } from './shared/http-request-interceptor/http-request-interceptor';

function initializeKeycloak(keycloak: KeycloakService): () => Promise<boolean> {
  return () =>
      keycloak.init({
          config: {
              url: 'https://api.learning-layers.eu/auth',
              realm: 'main',
              clientId: '8b7837a0-0b49-4443-9a56-591f50531d0a',
          },
          initOptions: {
              checkLoginIframe: true,
              checkLoginIframeInterval: 25,
              enableLogging: false
          },
          enableBearerInterceptor: true,
          loadUserProfileAtStartUp: true,
          bearerExcludedUrls: environment.hostUrls
      });
}


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    SharedModule,
    NavigationModule,
    LoginModule,
    SpaceModule,
    GraphViewModule,
    RouterModule.forRoot([
    { path: 'welcome', component: WelcomePageComponent },
    { path: 'login', component: LoginPageComponent },
    { path: 'afterlogin', component: AfterLoginComponent },
    { path: 'myspaces', component: SubscribedSpacesOverviewComponent, canActivate: [AuthGuardService] },
    { path: 'spaces/create', component: CreateSpaceComponent, canActivate: [AuthGuardService] },
    { path: 'spaces/:spaceId', component: GraphViewPageComponent, canActivate: [AuthGuardService] },
    { path: '**', redirectTo: 'welcome' }
], { relativeLinkResolution: 'legacy' }),
    HttpClientModule,
    KeycloakAngularModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
    { provide: HTTP_INTERCEPTORS,
      useClass: HttpRequestInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
