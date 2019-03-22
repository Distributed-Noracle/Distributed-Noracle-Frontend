import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateSpaceComponent} from './create-space/create-space.component';
import {SubscribedSpacesOverviewComponent} from './subscribed-spaces-overview/subscribed-spaces-overview.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {MatButtonModule, MatIconModule, MatInputModule, MatListModule, MatSnackBarModule} from '@angular/material';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSnackBarModule
  ],
  declarations: [CreateSpaceComponent, SubscribedSpacesOverviewComponent],
  exports: [CreateSpaceComponent, SubscribedSpacesOverviewComponent]
})
export class SpaceModule {
}
