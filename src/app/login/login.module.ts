import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginPageComponent} from './login-page/login-page.component';
import {MatButtonModule} from '@angular/material';
import {WelcomePageComponent} from './welcome-page/welcome-page.component';
import { AfterLoginComponent } from './after-login/after-login.component';

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
