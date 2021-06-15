import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from './nav/nav.component';
import {SpaceDropdownComponent} from './space-dropdown/space-dropdown.component';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

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
