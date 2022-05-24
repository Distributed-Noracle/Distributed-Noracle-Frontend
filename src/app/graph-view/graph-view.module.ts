import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatExpansionModule} from '@angular/material/expansion';
import {GraphViewComponent} from './graph-view/graph-view.component';
import {GraphViewPageComponent} from './graph-view-page/graph-view-page.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {FormsModule} from '@angular/forms';
import {GraphViewService} from './graph-view/graph-view.service';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SharedModule} from '../shared/shared.module';
import {RelationPickerDialogComponent} from './relation-picker-dialog/relation-picker-dialog.component';
import {CreateQuestionDialogComponent} from './create-question-dialog/create-question-dialog.component';
import {InspectDialogComponent} from './inspect-dialog/inspect-dialog.component';
import {VoteDonutComponent, ItemDirective} from './vote-donut/vote-donut.component';
import {InspectEdgeDialogComponent} from './inspect-edge-dialog/inspect-edge-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatRadioModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    FlexLayoutModule,
    SharedModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatProgressBarModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    GraphViewComponent,
    GraphViewPageComponent,
    RelationPickerDialogComponent,
    CreateQuestionDialogComponent,
    InspectDialogComponent,
    VoteDonutComponent,
    ItemDirective,
    InspectEdgeDialogComponent],
  bootstrap: [
    RelationPickerDialogComponent,
    CreateQuestionDialogComponent,
    InspectDialogComponent,
    VoteDonutComponent,
    InspectEdgeDialogComponent],
  exports: [GraphViewPageComponent],
  providers: [GraphViewService]
})
export class GraphViewModule {
}
