import {GraphViewService} from '../graph-view.service';
import {MdDialog} from '@angular/material';
import {AgentService} from '../../../shared/agent/agent.service';
import {EdgeInteractionBehavior} from './edge-interaction-behavior';
import {Edge} from '../graph-data-model/edge';
import {RelationPickerDialogComponent} from '../../relation-picker-dialog/relation-picker-dialog.component';
import {GraphNode} from '../graph-data-model/graph-node';
import {VoteDialogComponent} from '../../vote-dialog/vote-dialog.component';

export class EditRelationBehavior extends EdgeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private agentService: AgentService,
              private dialog: MdDialog) {
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
        const myVote = edge.getRelationVotes().find(vote => agent.agentid === vote.voterAgentId);
        const dialogRef = this.dialog.open(VoteDialogComponent, {
          width: '80%',
          data: {
            title: 'Assess Relation',
            message: 'Do you agree with this relation:\n'
            + (edge.source as GraphNode).question.text + '\n'
            + edge.relation.name + '\n'
            + (edge.source as GraphNode).question.text,
            upvoteText: 'I agree with this relation. It makes sense to me.',
            neutralText: 'I am undecided whether this relation makes sense to me.',
            downvoteText: 'I do not agree. I really cannot see the connection.',
            vote: myVote !== undefined ? myVote.value : 0
          }
        });
        return dialogRef.afterClosed().toPromise().then(result => {
          if (result !== undefined) {
            this.graphViewService.updateRelationVote(edge.id, agent.agentid, result);
          }
        });
      }
    });
  }
}
