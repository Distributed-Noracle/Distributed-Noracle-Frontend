import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {GraphViewService} from '../graph-view.service';
import {MdDialog} from '@angular/material';
import {InspectDialogComponent} from '../../inspect-dialog/inspect-dialog.component';
import {AgentService} from '../../../shared/agent/agent.service';
import {QuestionVoteService} from '../../../shared/question-vote/question-vote.service'
import {VoteDialogComponent} from '../../vote-dialog/vote-dialog.component';
import {timestamp} from 'rxjs/operator/timestamp';
import {VoteUtil} from '../utils/vote-util';

export class EditQuestionBehavior extends NodeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private agentService: AgentService,
              private questionVoteService: QuestionVoteService, private dialog: MdDialog) {
    super();
  }

  async interactWith(node: GraphNode, spaceId: string): Promise<any> {
    const agent = await this.agentService.getAgent();
    const authorName = await this.agentService.getAgentName(node.question.authorId);
    const questionVotes = await this.questionVoteService.getQuestionVotes(spaceId, node.id);
    const votes = VoteUtil.countVotes(questionVotes);

    const isAuthor = agent.agentid === node.question.authorId;
    const myVote = questionVotes.find(vote => agent.agentid === vote.voterAgentId);

    const data = {
      isAuthor: isAuthor,
      text: node.question.text,
      authorName: authorName,
      lastModified: new Date(node.question.timestampLastModified).toLocaleString(),
      inputHeading: `${authorName} (${node.question.timestampLastModified})`,
      votes: votes,
      vote: myVote ? myVote.value : undefined
    };

    const dialogRef = this.dialog.open(InspectDialogComponent, {data: data});
    const result = await dialogRef.afterClosed().toPromise();
    if (result !== undefined) {
      if (isAuthor) {
        await this.graphViewService.updateQuestion(node.id, data.text);
      } else if (data.vote !== undefined) {
        await this.graphViewService.updateQuestionVote(node.id, agent.agentid, data.vote);
      }
    }
  }
}
