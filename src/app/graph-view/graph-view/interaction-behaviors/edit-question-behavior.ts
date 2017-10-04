import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {GraphViewService} from '../graph-view.service';
import {MdDialog} from '@angular/material';
import {CreateQuestionDialogComponent} from '../../create-question-dialog/create-question-dialog.component';

export class EditQuestionBehavior extends NodeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private dialog: MdDialog) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    // TODO: handle edit attempts on questions of others
    const dialogRef = this.dialog.open(CreateQuestionDialogComponent, {
      width: '250px',
      data: {
        title: 'Edit Question',
        message: 'Edit question text and click Ok to save',
        text: node.question.text
      }
    });
    return dialogRef.afterClosed().toPromise().then(result => {
      if (result !== undefined) {
        return this.graphViewService.updateQuestion(node.id, result);
      }
    });
  }
}
