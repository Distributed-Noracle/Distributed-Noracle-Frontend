import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {GraphViewService} from '../graph-view.service';
import {MdDialog} from '@angular/material';
import {CreateQuestionDialogComponent} from '../../create-question-dialog/create-question-dialog.component';
import {AgentService} from '../../../shared/agent/agent.service';
import {VoteDialogComponent} from '../../vote-dialog/vote-dialog.component';

export class EditQuestionBehavior extends NodeInteractionBehavior {

  constructor(private graphViewService: GraphViewService, private agentService: AgentService,
              private dialog: MdDialog) {
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
        const myVote = node.questionVotes.find(vote => agent.agentid === vote.voterAgentId);
        const dialogRef = this.dialog.open(VoteDialogComponent, {
          width: '80%',
          data: {
            title: 'Assess Question',
            message: 'What is your opinion regarding this question:\n' + node.question.text,
            upvoteText: 'I like that question. It is particularly helpful for me.',
            neutralText: 'I am undecided whether this question is helpful for me.',
            downvoteText: 'This question did not help me.',
            vote: myVote !== undefined ? myVote.value : 0
          }
        });
        return dialogRef.afterClosed().toPromise().then(result => {
          if (result !== undefined) {
            this.graphViewService.updateQuestionVote(node.id, agent.agentid, result);
          }
        });
      }
    });
  }
}
