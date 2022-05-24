import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from './nav/nav.component';
import {SpaceDropdownComponent} from './space-dropdown/space-dropdown.component';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';

import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { SidenavListComponent } from './sidenav-list/sidenav-list.component';
import { MatListModule } from '@angular/material/list';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    FlexLayoutModule,
    RouterModule,
    MatListModule
  ],
  declarations: [
    NavComponent,
    SpaceDropdownComponent,
    SidenavListComponent
  ],
  exports: [
    NavComponent,
    SidenavListComponent
  ]
})
export class NavigationModule {
}
