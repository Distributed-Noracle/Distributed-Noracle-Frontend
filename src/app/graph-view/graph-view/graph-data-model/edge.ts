import {SimulationLinkDatum} from 'd3-force';
import {GraphNode} from './graph-node';

export class Edge implements SimulationLinkDatum<GraphNode> {

  source: string | number | GraphNode;
  target: string | number | GraphNode;

  constructor(from: number, to: number) {
    this.source = from;
    this.target = to;
  }

  draw(context: CanvasRenderingContext2D) {
    context.moveTo((this.source as GraphNode).x, (this.source as GraphNode).y);
    context.lineTo((this.target as GraphNode).x, (this.target as GraphNode).y);
  }
}
