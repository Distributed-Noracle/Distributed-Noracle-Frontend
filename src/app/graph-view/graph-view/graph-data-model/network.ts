import {GraphNode} from './graph-node';
import {Edge} from './edge';
import { Relation } from '../../../shared/rest-data-model/relation';
/**
 * Created by bgoeschlberger on 28.09.2017.
 */
export class Network {
  private nodes: GraphNode[] = [];
  private edges: Edge[] = [];

  /**
   * returns the collection of nodes in the network
   * do not add nodes via push!
   * use Network.addNode() to add nodes
   * @returns {GraphNode[]}
   */
  public getNodes(): GraphNode[] {
    return this.nodes;
  }

  /**
   * returns the collection of edges in the network
   * do not add edges via push!
   * use Network.addNode(), edges are generated from Node.relations
   * @returns {Edge[]}
   */
  public getEdges(): Edge[] {
    return this.edges;
  }

  public addOrUpdateNode(nodeToAdd: GraphNode): boolean {
    const nodeIndex = this.nodes.findIndex((n) => n.id === nodeToAdd.id);
    let hasChanged = false;
    if (nodeIndex !== -1) {
      const nodeToUpdate = this.nodes[nodeIndex];
      hasChanged = nodeToUpdate.update(nodeToAdd);
      nodeToAdd = nodeToUpdate;
    } else {
      this.nodes.push(nodeToAdd);
      hasChanged = true;
    }
    nodeToAdd.relations.forEach((r, i) => {
      const index = this.edges.findIndex((e) => e.id === r.relationId);
      const needsUpdate = index !== -1 && (!this.edges[index].relation.equals || !this.edges[index].relation.equals(r));
      if (needsUpdate) {
        this.edges.splice(index, 1);
      }
      if (index === -1 || needsUpdate) {
        // edge not yet in network
        const node1 = this.nodes.find((n) => r.firstQuestionId === n.id);
        const node2 = this.nodes.find((n) => n.id === r.secondQuestionId);
        if (node1 !== undefined && node2 !== undefined) {
          // both nodes are in the network
          this.edges.push(new Edge(r.relationId, node1, node2, r, nodeToAdd.relationAuthors[i]));
          // update nodes if necessary
          if (node1.relations.findIndex((n) => n.relationId === r.relationId) === -1) {
            node1.relations.push(r);
          }
          if (node2.relations.findIndex((n) => n.relationId === r.relationId) === -1) {
            node2.relations.push(r);
          }
        }
      }
    });
    return hasChanged;
  }

  public removeNode(node: GraphNode) {
    this.nodes.splice(this.nodes.indexOf(node), 1);
    for (let i = this.edges.length - 1; i >= 0; i--) {
      if (-1 !== node.relations.findIndex((rel) => rel.relationId === this.edges[i].id)) {
        this.edges.splice(i, 1);
      }
    }
  }

  public hasSelectedNeighbour(node: GraphNode): boolean {
    return -1 !== this.edges.findIndex(
        (e) => {
          if (e.source === node) {
            return (e.target as GraphNode).isSelected;
          } else if (e.target === node) {
            return (e.source as GraphNode).isSelected;
          } else {
            return false;
          }
        });
  }

  private updateEdgesForNode(node: GraphNode) {
    node.relations.forEach((relation, i) => {
      if (this.edges.findIndex(edge => edge.id === relation.relationId) === -1) {
        const outbound = relation.firstQuestionId === node.id;
        const otherNodeId = (outbound ? relation.secondQuestionId : relation.firstQuestionId);
        const otherNode = this.nodes.find(n => n.id === otherNodeId);
        if (otherNode !== undefined) {
          if (otherNode.relations.findIndex(rel => rel.relationId === relation.relationId) === -1) {
            otherNode.relations.push(relation);
          }
          this.edges.push(new Edge(relation.relationId,
            outbound ? node : otherNode, outbound ? otherNode : node, relation, node.relationAuthors[i]));
        }
      }
    });
  }

  public countInvisibleNeighbors(node: GraphNode) {
    let sum = 0;
    node.relations.forEach(relation => {
      const other = relation.firstQuestionId === node.question.questionId ? relation.secondQuestionId : relation.firstQuestionId;
      if (this.nodes.findIndex(n => n.question.questionId === other) === -1) {
        sum++;
      }
    });
    return sum;
  }
}
