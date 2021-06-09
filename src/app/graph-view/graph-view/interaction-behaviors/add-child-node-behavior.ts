import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {GraphViewService} from '../graph-view.service';
import {Question} from '../../../shared/rest-data-model/question';
import {CreateQuestionDialogComponent} from '../../create-question-dialog/create-question-dialog.component';
import { MatDialog } from '@angular/material/dialog';

export class AddChildNodeBehavior extends NodeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private dialog: MatDialog) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    const dialogRef = this.dialog.open(CreateQuestionDialogComponent, {
      width: '250px',
      data: {
        title: 'Ask a Follow Up Question',
        message: 'Enter the question. Parent question is: ' + node.question.text,
        text: ''
      }
    });
    return dialogRef.afterClosed().toPromise().then(result => {
      if (result !== undefined) {
        const question =  new Question();
        question.text = result;
        return this.graphViewService.addQuestionToParentAndRegisterForUpdate(question, node.id);
      }
    });
  }
}
