import {GraphViewService} from '../graph-view.service';
import {MdDialog} from '@angular/material';
import {AgentService} from '../../../shared/agent/agent.service';
import {EdgeInteractionBehavior} from './edge-interaction-behavior';
import {Edge} from '../graph-data-model/edge';
import {GraphNode} from '../graph-data-model/graph-node';
import {RelationVote} from '../../../shared/rest-data-model/relation-vote';
import {VoteUtil} from '../utils/vote-util';
import {InspectEdgeDialogComponent} from '../../inspect-edge-dialog/inspect-edge-dialog.component';
import { RelationType } from '../graph-data-model/relation-type.enum';

export class EditRelationBehavior extends EdgeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private agentService: AgentService,
              private dialog: MdDialog) {
    super();
  }

  async interactWith(edge: Edge): Promise<any> {
    const agent = await this.agentService.getAgent();
    const authorName = await this.agentService.getAgentName(edge.relation.authorId);
    const relationVotes = edge.getRelationVotes();
    const votes = VoteUtil.countVotes(relationVotes);

    const isAuthor = agent.agentid === edge.relation.authorId;
    const myVote = relationVotes.find(vote => agent.agentid === vote.voterAgentId);

    const data = {
      isAuthor: isAuthor,
      sourceText: (edge.source as GraphNode).question.text,
      targetText: (edge.target as GraphNode).question.text,
      authorName: authorName,
      lastModified: new Date(edge.relation.timestampLastModified).toLocaleString(),
      votes: votes,
      vote: myVote ? myVote.value : undefined,
      relationType: edge.relation.name,
      relationTypes: Object.keys(RelationType).filter(k => typeof RelationType[k as any] === 'number'),
      relationTypeText: edge.relation.name === 'FollowUp' ? 'follows from' : 'is linked to',
      relationTypesText: ['follows from', 'is linked to'],
    };

    const dialogRef = this.dialog.open(InspectEdgeDialogComponent, {data: data});
    const result = await dialogRef.afterClosed().toPromise();
    if (result !== undefined) {
      if (isAuthor) {
          await this.graphViewService.updateRelation(edge.id, data.relationType);
      } else if (data.vote !== undefined) {
        await this.graphViewService.updateRelationVote(edge.id, agent.agentid, data.vote);
      }
    }
  }
}
