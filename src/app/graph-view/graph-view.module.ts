import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphViewComponent } from './graph-view/graph-view.component';
import { TextlayoutService } from './textlayout.service';
import { RestService } from './rest-service/rest.service';
import { SpaceService } from './space.service';
import { QuestionService } from './question.service';
import { RelationService } from './relation.service';

@NgModule({
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [GraphViewComponent],
  exports: [GraphViewComponent],
  providers: [TextlayoutService, RestService, SpaceService, QuestionService, RelationService]
})
export class GraphViewModule { }
