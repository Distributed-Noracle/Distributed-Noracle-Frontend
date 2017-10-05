import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NavComponent} from './nav/nav.component';
import {SpaceDropdownComponent} from './space-dropdown/space-dropdown.component';
import {MdButtonModule, MdMenuModule, MdToolbarModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {FlexLayoutModule} from '@angular/flex-layout';
import {IronElementsModule, PaperElementsModule} from '@codebakery/origami/collections';

@NgModule({
  imports: [
    CommonModule,
    IronElementsModule,
    PaperElementsModule,
    MdMenuModule,
    MdToolbarModule,
    MdButtonModule,
    FlexLayoutModule,
    RouterModule
  ],
  declarations: [NavComponent, SpaceDropdownComponent],
  exports: [NavComponent]
})
export class NavigationModule {
}
