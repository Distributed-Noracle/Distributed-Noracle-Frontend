import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GraphViewComponent} from './graph-view/graph-view.component';
import {TextlayoutService} from './textlayout.service';
import {RestService} from './rest-service/rest.service';
import {SpaceService} from './space.service';
import {QuestionService} from './question.service';
import {RelationService} from './relation.service';
import {D3Service} from 'd3-ng2-service';
import { GraphViewPageComponent } from './graph-view-page/graph-view-page.component';

@NgModule({
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [GraphViewComponent, GraphViewPageComponent],
  exports: [GraphViewPageComponent],
  providers: [TextlayoutService, RestService, SpaceService, QuestionService, RelationService, D3Service]
})
export class GraphViewModule {
}
