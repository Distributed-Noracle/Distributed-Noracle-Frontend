import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {Network} from '../graph-data-model/network';
import {Relation} from '../../../shared/rest-data-model/relation';

export class AddRelationBehavior extends NodeInteractionBehavior {

  private firstSelectedNode: GraphNode;

  constructor(private network: Network) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    if (this.firstSelectedNode === undefined) {
      this.firstSelectedNode = node;
      return Promise.resolve();
    } else {
      return new Promise((resolve, reject) => {
        const input = window.prompt('What type of relation would you like to create from ['
          + this.firstSelectedNode.label + '] to [' + node.label + ']?');
        if (input !== undefined) {
          const newRel = new Relation();
          newRel.firstQuestionId = this.firstSelectedNode.id;
          newRel.secondQuestionId = node.id;
          newRel.relationId = '[' + this.firstSelectedNode.id + '][' + node.id + ']';
          newRel.name = input;
          newRel.directed = true;
          this.network.addRelationToNode(newRel, this.firstSelectedNode);
        }
        this.firstSelectedNode = undefined;
        resolve();
      });
    }
  }
}
