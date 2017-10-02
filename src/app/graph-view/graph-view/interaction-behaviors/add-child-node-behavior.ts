import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {Relation} from '../../../shared/rest-data-model/relation';
import {Network} from '../graph-data-model/network';

export class AddChildNodeBehavior extends NodeInteractionBehavior {

  constructor(private network: Network, private context: CanvasRenderingContext2D) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    return new Promise((resolve, reject) => {
      const label = window.prompt('Ask a follow up question to: ' + node.label);
      if (label !== null) {
        // TODO: POST question, use questionId from response, POST relation
        const newId = this.network.getNodes().reduce((p, c) => (p === null || c.id > p.id) ? c : p, null).id + 1;
        const newRel = new Relation();
        newRel.firstQuestionId = node.id;
        newRel.secondQuestionId = newId;
        newRel.relationId = '[' + node.id + '][' + newId + ']';
        newRel.name = 'follow up';
        newRel.directed = true;
        const newNode = new GraphNode(this.context, newId, label, [newRel]);
        newNode.x = node.x;
        newNode.y = node.y;
        newNode.isSelected = true;
        this.network.addOrUpdateNode(newNode);
      }
      resolve();
    });
  }
}
