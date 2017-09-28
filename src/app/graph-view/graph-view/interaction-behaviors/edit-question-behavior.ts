import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';

export class EditQuestionBehavior extends NodeInteractionBehavior {

  constructor(private context: CanvasRenderingContext2D) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    return new Promise((resolve, reject) => {
      const label = window.prompt('Edit Question:', node.label);
      if (label !== null) {
        node.setLabel(label, this.context);
      }
      resolve();
    });
  }
}
