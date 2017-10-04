import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {GraphViewService} from '../graph-view.service';
import {MdDialog, MdSnackBar} from '@angular/material';
import {CreateQuestionDialogComponent} from '../../create-question-dialog/create-question-dialog.component';
import {AgentService} from '../../../shared/agent/agent.service';

export class EditQuestionBehavior extends NodeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private agentService: AgentService,
              private dialog: MdDialog, private snackBar: MdSnackBar) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    return this.agentService.getAgent().then((agent) => {
      if (agent.agentid === node.question.authorId) {
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
      } else {
        return this.snackBar.open('Sorry, you can only modify your own questions.', 'hide', {
          duration: 2000,
        });
      }
    });
  }
}
