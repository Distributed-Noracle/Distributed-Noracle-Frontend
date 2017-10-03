import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {GraphViewService} from '../graph-view.service';
import {Question} from '../../../shared/rest-data-model/question';

export class AddChildNodeBehavior extends NodeInteractionBehavior {

  constructor(private graphViewService: GraphViewService) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    return new Promise((resolve, reject) => {
      const label = window.prompt('Ask a follow up question to: ' + node.label);
      if (label !== null) {
        // TODO: POST question, use questionId from response, POST relation
        const question =  new Question();
        question.text = label;
        this.graphViewService.addQuestionToParentAndRegisterForUpdate(question, node.id);
      }
      resolve();
    });
  }
}
