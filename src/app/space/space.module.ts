import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateSpaceComponent} from './create-space/create-space.component';
import {SubscribedSpacesOverviewComponent} from './subscribed-spaces-overview/subscribed-spaces-overview.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MdButtonModule, MdIconModule, MdInputModule, MdListModule, MdSnackBarModule, MdMenuModule} from '@angular/material';
import {IronElementsModule, PaperElementsModule} from '@codebakery/origami/collections';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    IronElementsModule,
    PaperElementsModule,
    MdInputModule,
    MdButtonModule,
    MdListModule,
    MdIconModule,
    MdSnackBarModule,
    MdMenuModule
  ],
  declarations: [CreateSpaceComponent, SubscribedSpacesOverviewComponent],
  exports: [CreateSpaceComponent, SubscribedSpacesOverviewComponent]
})
export class SpaceModule {
}
