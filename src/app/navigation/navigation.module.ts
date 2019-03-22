import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from './nav/nav.component';
import {SpaceDropdownComponent} from './space-dropdown/space-dropdown.component';
import {MatButtonModule, MatMenuModule, MatToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    FlexLayoutModule,
    RouterModule
  ],
  declarations: [NavComponent, SpaceDropdownComponent],
  exports: [NavComponent]
})
export class NavigationModule {
}
