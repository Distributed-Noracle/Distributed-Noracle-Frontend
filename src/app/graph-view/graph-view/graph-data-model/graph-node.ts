import {SimulationNodeDatum} from 'd3-force';

export class GraphNode implements SimulationNodeDatum {
  /**
   * Node’s zero-based index into nodes array. This property is set during the initialization process of a simulation.
   */
  index?: number;
  /**
   * Node’s current x-position
   */
  x?: number;
  /**
   * Node’s current y-position
   */
  y?: number;
  /**
   * Node’s current x-velocity
   */
  vx?: number;
  /**
   * Node’s current y-velocity
   */
  vy?: number;
  /**
   * Node’s fixed x-position (if position was fixed)
   */
  fx?: number | null;
  /**
   * Node’s fixed y-position (if position was fixed)
   */
  fy?: number | null;

  constructor(public id: number, public label: string) {
  }

  draw(context: CanvasRenderingContext2D) {
    context.moveTo(this.x + 5, this.y);
    context.arc(this.x, this.y, 5, 0, 2 * Math.PI);
    // TODO: draw nodes with labels
  }
}
