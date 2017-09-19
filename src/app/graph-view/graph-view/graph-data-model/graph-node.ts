import {SimulationNodeDatum} from 'd3-force';

export class GraphNode implements SimulationNodeDatum {

  private lines: string[];
  private textSize = 10;


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

  constructor(context: CanvasRenderingContext2D, public id: number, public label: string, public radius: number = 20) {
    this.lines = this.wrapText((s) => context.measureText(s).width, this.textSize * 1.5);
  }

  draw(context: CanvasRenderingContext2D) {
    context.beginPath();
    context.moveTo(this.x + this.radius, this.y);
    context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context.strokeStyle = '#000';
    context.stroke();
    context.fillStyle = '#fff';
    context.fill();
    context.beginPath();
    context.fillStyle = '#000';
    context.font = this.textSize + 'px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'top';
    let i = 0;
    for (const line of this.lines) {
      const yOffset = -(this.textSize * 1.5 * this.lines.length) / 2 + (i * this.textSize * 1.5);
      context.fillText(line, this.x, this.y + yOffset);
      i++;
    }
    // TODO: draw nodes with labels
  }

  wrapText(measure: (string) => number, textHeigth: number) {
    const totalWidth = measure(this.label);
    const words = this.label.split(/\s+/);
    // min line length should at least be able to fit first/last word
    const minLineLength = words.length > 0 ?
      Math.max(measure(words[0]), measure(words[words.length - 1]))
      : totalWidth;
    let fit = false;
    let radius = Math.floor(Math.sqrt(totalWidth * textHeigth / 2));
    while (!fit) {
      const numberOfLines =
        Math.floor(Math.sqrt(2 * (Math.pow(radius, 2) - Math.pow(minLineLength / 2, 2)) - textHeigth / 2) / textHeigth);
      const lines = [''];
      let lineNumber = 0;
      let remainingLineLength =
        2 * Math.sqrt(Math.pow(radius, 2) - Math.pow(textHeigth / 2 + textHeigth * numberOfLines / 2, 2));
      fit = true;
      for (const word of words) {
        const wordWith = measure(word);
        if (remainingLineLength > wordWith) {
          lines[lineNumber] += word + ' ';
          remainingLineLength -= (wordWith + 1);
        } else {
          lines[lineNumber] = lines[lineNumber].trim();
          lineNumber++;
          remainingLineLength =
            2 * Math.sqrt(Math.pow(radius, 2) - Math.pow(textHeigth / 2 + textHeigth * Math.abs((numberOfLines - 1) / 2 - lineNumber), 2));
          if (remainingLineLength > wordWith) {
            lines.push(word + ' ');
          } else {
            fit = false;
            break;
          }
          if (lineNumber > numberOfLines) {
            fit = false;
            break;
          }
        }
      }
      if (!fit) {
        radius++;
      } else {
        this.radius = radius * 1.2;
        return lines;
      }
    }
  }
}
