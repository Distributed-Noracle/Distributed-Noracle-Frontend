import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {Network} from '../graph-data-model/network';
import {GraphViewService} from '../graph-view.service';

export class ChangeNodeSelectionBehavior extends NodeInteractionBehavior {

  constructor(private network: Network, private graphViewService: GraphViewService,
              private context: CanvasRenderingContext2D) {
    super();
  }

  interactWith(node: GraphNode): Promise<any> {
    if (node.isSelected) {
      if (this.network.getNodes().filter((n) => n.isSelected).length > 1) {
        return this.deselectNode(node);
      } else {
        return Promise.resolve(window.alert('You can\'t deselect the last selected node.'));
      }
    } else {
      return Promise.resolve(this.selectNode(node));
    }
  }

  private deselectNode(n: GraphNode): Promise<any> {
    n.isSelected = false;
    return new Promise((resolve, reject) => {
      const nodes = this.network.getNodes();
      for (let i = nodes.length - 1; i >= 0; i--) {
        const node = nodes[i];
        if (!node.isSelected && !this.network.hasSelectedNeighbour(node)) {
          this.network.removeNode(node);
          this.graphViewService.unregisterQuestionForUpdate(node.id);
        }
      }
      resolve();
    });
  }

  private selectNode(n: GraphNode) {
    n.isSelected = true;
    let requiresUpdate = false;
    n.relations.forEach((r) => {
      if (this.graphViewService.registerQuestionForUpdate(r.firstQuestionId === n.id ? r.secondQuestionId : r.firstQuestionId)) {
        requiresUpdate = true;
      }
    });
    if (requiresUpdate) {
      this.graphViewService.requestUpdate();
    }
  }
}
