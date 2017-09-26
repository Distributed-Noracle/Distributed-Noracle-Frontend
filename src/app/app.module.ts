import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {GraphViewModule} from './graph-view/graph-view.module';
import {PolymerModule} from '@codebakery/origami';
import {IronElementsModule, PaperElementsModule} from '@codebakery/origami/collections';
import {AuthModule, OidcSecurityService, OpenIDImplicitFlowConfiguration} from 'angular-auth-oidc-client';
import {RouterModule} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {environment} from '../environments/environment';
import {GraphViewPageComponent} from './graph-view/graph-view-page/graph-view-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MdButtonModule, MdMenuModule, MdToolbarModule} from '@angular/material';
import {NavComponent} from './nav/nav.component';
import {AuthGuardService} from './auth-guard/auth-guard.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    IronElementsModule,
    PaperElementsModule,
    FlexLayoutModule,
    GraphViewModule,
    MdMenuModule,
    MdToolbarModule,
    MdButtonModule,
    RouterModule.forRoot([
      {path: 'login', component: LoginComponent},
      {path: 'graph', component: GraphViewPageComponent, canActivate: [AuthGuardService]},
      {path: '**', redirectTo: 'login' }
    ]),
    PolymerModule.forRoot(),
    AuthModule.forRoot()
  ],
  providers: [OidcSecurityService, AuthGuardService],
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
    openIDImplicitFlowConfiguration.startup_route = '/graph';
    openIDImplicitFlowConfiguration.auto_userinfo = true;
    openIDImplicitFlowConfiguration.log_console_warning_active = !environment.production;
    openIDImplicitFlowConfiguration.log_console_debug_active = !environment.production;
    openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;
    openIDImplicitFlowConfiguration.override_well_known_configuration = false;

    // TODO: configure
    openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
    openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';

    this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
  }
}
