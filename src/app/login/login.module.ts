import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPageComponent} from './login-page/login-page.component';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import { AfterLoginComponent } from './after-login/after-login.component';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule
  ],
  declarations: [LoginPageComponent, WelcomePageComponent, AfterLoginComponent],
  exports: [LoginPageComponent, WelcomePageComponent]
})
export class LoginModule {
}
