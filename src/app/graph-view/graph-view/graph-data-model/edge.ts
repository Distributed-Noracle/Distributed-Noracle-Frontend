import {SimulationLinkDatum} from 'd3-force';
import {GraphNode} from './graph-node';

export class Edge implements SimulationLinkDatum<GraphNode> {

  source: string | number | GraphNode;
  target: string | number | GraphNode;

  constructor(from: number | GraphNode, to: number | GraphNode) {
    this.source = from;
    this.target = to;
  }

  getDistance() {
    return (this.source as GraphNode).radius + (this.target as GraphNode).radius + 10;
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo((this.source as GraphNode).x, (this.source as GraphNode).y);
    context.lineTo((this.target as GraphNode).x, (this.target as GraphNode).y);
    context.strokeStyle = '#000';
    context.stroke();
  }
}
