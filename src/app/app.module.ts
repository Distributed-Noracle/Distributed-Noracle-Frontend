import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {AppComponent} from './app.component';
import {GraphViewModule} from './graph-view/graph-view.module';
import {PolymerModule} from '@codebakery/origami';
import {AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration} from 'angular-auth-oidc-client';
import {RouterModule} from '@angular/router';
import {environment} from '../environments/environment';
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

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    SharedModule,
    NavigationModule,
    LoginModule,
    SpaceModule,
    GraphViewModule,
    RouterModule.forRoot([
      {path: 'welcome', component: WelcomePageComponent},
      {path: 'login', component: LoginPageComponent},
      {path: 'afterlogin', component: AfterLoginComponent},
      {path: 'myspaces', component: SubscribedSpacesOverviewComponent, canActivate: [AuthGuardService]},
      {path: 'spaces/create', component: CreateSpaceComponent, canActivate: [AuthGuardService]},
      {path: 'spaces/:spaceId', component: GraphViewPageComponent, canActivate: [AuthGuardService]},
      {path: '**', redirectTo: 'welcome'}
    ]),
    PolymerModule.forRoot(),
    AuthModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public oidcSecurityService: OidcSecurityService) {

    const openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
    openIDImplicitFlowConfiguration.stsServer = 'https://api.learning-layers.eu/o/oauth2';
    openIDImplicitFlowConfiguration.redirect_url = environment.redirectUrl;
    openIDImplicitFlowConfiguration.client_id = '8b7837a0-0b49-4443-9a56-591f50531d0a';
    openIDImplicitFlowConfiguration.response_type = 'id_token token';
    openIDImplicitFlowConfiguration.scope = 'openid email profile';
    openIDImplicitFlowConfiguration.post_logout_redirect_uri = environment.redirectUrl;
    openIDImplicitFlowConfiguration.startup_route = '/afterlogin';
    openIDImplicitFlowConfiguration.auto_userinfo = true;
    openIDImplicitFlowConfiguration.log_console_warning_active = !environment.production;
    openIDImplicitFlowConfiguration.log_console_debug_active = !environment.production;
    openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;
    openIDImplicitFlowConfiguration.override_well_known_configuration = false;
    openIDImplicitFlowConfiguration.silent_renew = false;

    // TODO: configure
    openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
    openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';

    this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
  }
}
