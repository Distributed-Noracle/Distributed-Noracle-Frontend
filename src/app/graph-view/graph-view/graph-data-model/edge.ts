import {SimulationLinkDatum} from 'd3-force';
import {GraphNode} from './graph-node';
import {Relation} from '../../../shared/rest-data-model/relation';
import {DrawUtil} from '../utils/draw-util';

export class Edge implements SimulationLinkDatum<GraphNode> {

  public isSelected = false;

  constructor(public id: string,
              public source: string | number | GraphNode,
              public target: string | number | GraphNode,
              public relation: Relation,
              public relationAuthor: string) {
  }

  getDistance() {
    return (this.source as GraphNode).radius + (this.target as GraphNode).radius + 10;
  }

  getRelationVotes() {
    return (this.source as GraphNode).relationVotes.get(this.id);
  }

  draw(context: CanvasRenderingContext2D) {
    if (this.relation.directed) {
      this.drawDirected(context);
    } else {
      this.drawUndirected(context);
    }
    context.beginPath();
    const dx = (this.target as GraphNode).x - (this.source as GraphNode).x;
    const dy = (this.target as GraphNode).y - (this.source as GraphNode).y;
    context.fillText(this.relationAuthor, (this.source as GraphNode).x + dx / 2, (this.source as GraphNode).y + dy / 2);
    context.stroke();
  }

  drawDirected(context: CanvasRenderingContext2D) {
    context.beginPath();
    const arrowSize = 3;
    const arrowGap = 5;
    const dx = (this.target as GraphNode).x - (this.source as GraphNode).x;
    const dy = (this.target as GraphNode).y - (this.source as GraphNode).y;
    const len = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
    const dx0 = dx / len;
    const dy0 = dy / len;
    for (let i = 0; i <= len; i += arrowGap) {
      const x = (this.source as GraphNode).x + i * dx0;
      const y = (this.source as GraphNode).y + i * dy0;
      context.moveTo(x - dx0 * arrowSize - dy0 * arrowSize, y - dy0 * arrowSize + dx0 * arrowSize);
      context.lineTo(x, y);
      context.lineTo(x - dx0 * arrowSize + dy0 * arrowSize, y - dy0 * arrowSize - dx0 * arrowSize);
    }
    context.lineWidth = this.isSelected ? 3 : 1;
    const relationVotes = this.getRelationVotes();
    context.strokeStyle = DrawUtil.getColorCodeForValueInScale(relationVotes.map(v => v.value).reduce((p, c) => p + c, 0),
      -relationVotes.length, relationVotes.length);
    context.stroke();
  }

  drawUndirected(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo((this.source as GraphNode).x, (this.source as GraphNode).y);
    context.lineTo((this.target as GraphNode).x, (this.target as GraphNode).y);
    context.lineWidth = this.isSelected ? 3 : 1;
    const relationVotes = this.getRelationVotes();
    context.strokeStyle = DrawUtil.getColorCodeForValueInScale(relationVotes.map(v => v.value).reduce((p, c) => p + c, 0),
      -relationVotes.length, relationVotes.length);
    context.stroke();
  }
}
