import {SimulationNodeDatum} from 'd3-force';
import {Relation} from '../../../shared/rest-data-model/relation';

export class GraphNode implements SimulationNodeDatum {
  private lines: string[];
  private textSize = 10;
  private bubbleScaleFactor = 1.25;
  public radius;

  /**
   * Node’s current x-position
   */
  x?: number;
  /**
   * Node’s current y-position
   */
  y?: number;


  constructor(context: CanvasRenderingContext2D, public id: string, public label: string,
              public relations: Relation[], public isSelected = false) {
    this.lines = this.wrapText((s) => context.measureText(s).width);
  }

  public setLabel(label: string, context: CanvasRenderingContext2D) {
    this.label = label;
    this.lines = this.wrapText((s) => context.measureText(s).width);
  }

  draw(context: CanvasRenderingContext2D) {
    const alpha = Math.PI / 8;
    const beta = Math.PI / 16;
    context.beginPath();
    context.moveTo(this.x + this.radius / this.bubbleScaleFactor, this.y);
    context.arc(this.x, this.y, this.radius / this.bubbleScaleFactor, 0, alpha);
    context.lineTo(this.x + Math.cos(alpha + beta / 2) * this.radius, this.y + Math.sin(alpha + beta / 2) * this.radius);
    context.arc(this.x, this.y, this.radius / this.bubbleScaleFactor, alpha + beta, 2 * Math.PI);
    context.strokeStyle = '#000';
    context.lineWidth = this.isSelected ? 3 : 1;
    context.stroke();
    context.fillStyle = '#fff';
    context.fill();
    context.beginPath();
    context.fillStyle = '#000';
    context.font = this.textSize + 'px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'top';

    for (let i = 0; i < this.lines.length; i++) {
      const yOffset = -(this.getTextHeigth() * this.lines.length) / 2 + (i * this.getTextHeigth());
      context.fillText(this.lines[i], this.x, this.y + yOffset);
    }
  }

  getTextHeigth() {
    return this.textSize * 1.5;
  }

  wrapText(measure: (string) => number) {
    const textHeight = this.getTextHeigth();
    const totalWidth = measure(this.label);
    const words = this.label.split(/\s+/);
    const longestWordLength =
      Math.ceil(measure(words.reduce((prev, cur, i) => measure(prev) > measure(cur) ? prev : cur)));
    const blankWidth = measure(' ');
    let fit = false;
    let radius = Math.floor(Math.sqrt(totalWidth * textHeight / 3));
    radius = radius > longestWordLength / 2 ? radius : longestWordLength / 2;
    while (!fit) {
      const numberOfLines = Math.floor(2 * radius / textHeight);
      const lines = [''];
      let remainingLineLength =
        2 * Math.sqrt(Math.pow(radius, 2) - Math.pow(textHeight * numberOfLines / 2, 2));
      fit = true;
      for (const word of words) {
        const wordWith = measure(word);
        while (remainingLineLength < wordWith) {
          // skip lines that are too short for the word
          lines[lines.length - 1] = lines[lines.length - 1].trim();
          lines.push('');
          remainingLineLength =
            2 * Math.sqrt(Math.pow(radius, 2) - Math.pow(textHeight * Math.abs(numberOfLines / 2 - (lines.length - 1)), 2));
          if (lines.length > numberOfLines) {
            // word was too long for all remaining lines
            fit = false;
            break;
          }
        }
        lines[lines.length - 1] += word + ' ';
        remainingLineLength -= (wordWith + blankWidth);
      }
      if (!fit) {
        radius++;
      } else {
        while (lines.length - 1 < numberOfLines) {
          lines.push('');
        }
        this.radius = (radius + textHeight * 0.5) * this.bubbleScaleFactor;
        return lines;
      }
    }
  }

  update(n: GraphNode) {
    this.label = n.label;
    this.lines = n.lines;
    this.radius = n.radius;
    this.textSize = n.textSize;
    this.bubbleScaleFactor = n.bubbleScaleFactor;
    this.relations = n.relations;
  }
}
