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
import {HomeScreenComponent} from './home-screen/home-screen.component';
import {LoginComponent} from './login/login.component';
import {environment} from '../environments/environment';
import {GraphViewPageComponent} from './graph-view/graph-view-page/graph-view-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeScreenComponent,
    LoginComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    IronElementsModule,
    PaperElementsModule,
    GraphViewModule,
    RouterModule.forRoot([
      { path: '', component: HomeScreenComponent },
      { path: 'login', component: LoginComponent },
      { path: 'graph', component: GraphViewPageComponent }
    ]),
    PolymerModule.forRoot(),
    AuthModule.forRoot()
  ],
  providers: [OidcSecurityService],
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
    openIDImplicitFlowConfiguration.forbidden_route = '/Forbidden';
    openIDImplicitFlowConfiguration.unauthorized_route = '/Unauthorized';
    openIDImplicitFlowConfiguration.auto_userinfo = true;
    openIDImplicitFlowConfiguration.log_console_warning_active = true;
    openIDImplicitFlowConfiguration.log_console_debug_active = false;
    openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 10;
    openIDImplicitFlowConfiguration.override_well_known_configuration = false;
    // openIDImplicitFlowConfiguration.override_well_known_configuration_url = '';
    // openIDImplicitFlowConfiguration.storage = localStorage;

    this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration);
  }
}