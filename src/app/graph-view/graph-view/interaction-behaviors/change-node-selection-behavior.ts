import {NodeInteractionBehavior} from './node-interaction-behavior';
import {GraphNode} from '../graph-data-model/graph-node';
import {Network} from '../graph-data-model/network';
import {GraphViewService} from '../graph-view.service';
import {Question} from '../../../shared/rest-data-model/question';

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
      return this.selectNode(node);
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
        }
      }
      resolve();
    });
  }

  private selectNode(n: GraphNode): Promise<any> {
    n.isSelected = true;
    return this.graphViewService.getRelationsForQuestion(n.id)
      .then((relations) => {
        const promises = [];
        const newIds: string[] = [];
        relations.forEach((r) => {
          const id = r.firstQuestionId === n.id ? r.secondQuestionId : r.firstQuestionId;
          if (this.network.getNodes().findIndex((node) => node.id === id) === -1
            && newIds.indexOf(id) === -1) {
            // question not yet in network and not yet scheduled for download
            newIds.push(id);
            promises.push(this.graphViewService.getQuestion(id));
          }
        });
        return Promise.all<Question>(promises).then((questions) => {
          for (let i = questions.length - 1; i >= 0; i--) {
            const question = questions[i];
            const graphNode = new GraphNode(this.context, question.questionId, question.text,
              relations.filter(
                (r) => r.firstQuestionId === question.questionId || r.secondQuestionId === question.questionId
              )
            );
            graphNode.x = n.x;
            graphNode.y = n.y;
            this.network.addNode(graphNode);
          }
        });
      });
  }
}
