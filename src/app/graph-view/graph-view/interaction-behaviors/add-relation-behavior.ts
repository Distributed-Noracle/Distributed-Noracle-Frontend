import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {Relation} from '../../../shared/rest-data-model/relation';
import {RelationPickerDialogComponent} from '../../relation-picker-dialog/relation-picker-dialog.component';
import {GraphViewService} from '../graph-view.service';
import {RelationType} from '../graph-data-model/relation-type.enum';
import {MatDialog} from '@angular/material/dialog';

export class AddRelationBehavior extends NodeInteractionBehavior {

  private firstSelectedNode: GraphNode;

  constructor(private graphViewService: GraphViewService, private dialog: MatDialog) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    if (this.firstSelectedNode === undefined) {
      this.firstSelectedNode = node;
      return Promise.resolve();
    } else {
      const firstNode = this.firstSelectedNode;
      this.firstSelectedNode = undefined;
      const dialogRef = this.dialog.open(RelationPickerDialogComponent, {
        width: '250px',
        data: {
          title: 'Choose the type of relation', message: 'What type of relation would you like to create from\n1.)'
          + firstNode.question.text + '\nto\n2.)' + node.question.text
        }
      });
      return dialogRef.afterClosed().toPromise().then(result => {
        if (result !== undefined) {
          const newRel = new Relation();
          newRel.firstQuestionId = firstNode.id;
          newRel.secondQuestionId = node.id;
          newRel.name = RelationType[result];
          newRel.directed = (result === RelationType.FollowUp);
          this.graphViewService.addRelation(newRel);
        }
      });
    }
  }
}
