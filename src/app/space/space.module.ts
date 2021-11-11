import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateSpaceComponent} from './create-space/create-space.component';
import {SubscribedSpacesOverviewComponent} from './subscribed-spaces-overview/subscribed-spaces-overview.component';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FlexLayoutModule } from '@angular/flex-layout';


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    FlexLayoutModule
  ],
  declarations: [CreateSpaceComponent, SubscribedSpacesOverviewComponent],
  exports: [CreateSpaceComponent, SubscribedSpacesOverviewComponent]
})
export class SpaceModule {
}
