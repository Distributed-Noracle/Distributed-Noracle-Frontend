import {GraphViewService} from '../graph-view.service';
import {MdDialog, MdSnackBar} from '@angular/material';
import {AgentService} from '../../../shared/agent/agent.service';
import {EdgeInteractionBehavior} from './edge-interaction-behavior';
import {Edge} from '../graph-data-model/edge';
import {RelationPickerDialogComponent} from '../../relation-picker-dialog/relation-picker-dialog.component';
import {GraphNode} from '../graph-data-model/graph-node';

export class EditRelationBehavior extends EdgeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private agentService: AgentService,
              private dialog: MdDialog, private snackBar: MdSnackBar) {
    super();
  }

  interactWith(edge: Edge): Promise<any> {
    return this.agentService.getAgent().then((agent) => {
      if (agent.agentid === edge.relation.authorId) {
        const dialogRef = this.dialog.open(RelationPickerDialogComponent, {
          width: '250px',
          data: {
            title: 'Edit Relation',
            message: 'You can change the relation type of the relation between:\n1.) '
            + (edge.source as GraphNode).question.text + '\nand\n2.) '
            + (edge.target as GraphNode).question.text,
            selectedRelationType: edge.relation.name
          }
        });
        return dialogRef.afterClosed().toPromise().then(result => {
          if (result !== undefined) {
            return this.graphViewService.updateRelation(edge.id, result);
          }
        });
      } else {
        return this.snackBar.open('Sorry, you can only modify your own relations.', 'hide', {
          duration: 2000,
        });
      }
    });
  }
}
