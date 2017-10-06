import {SimulationNodeDatum} from 'd3-force';
import {Relation} from '../../../shared/rest-data-model/relation';
import {Question} from '../../../shared/rest-data-model/question';
import {QuestionVote} from '../../../shared/rest-data-model/question-vote';
import {RelationVote} from '../../../shared/rest-data-model/relation-vote';
import {DrawUtil} from '../utils/draw-util';

export class GraphNode implements SimulationNodeDatum {
  private lines: string[];
  private textSize = 10;
  private bubbleScaleFactor = 1.25;
  public radius;
  public relationVotes: Map<string, RelationVote[]> = new Map<string, RelationVote[]>();

  /**
   * Node’s current x-position
   */
  x?: number;
  /**
   * Node’s current y-position
   */
  y?: number;


  constructor(context: CanvasRenderingContext2D, public id: string,
              public question: Question, public questionAuthor: string, public questionVotes: QuestionVote[],
              public relations: Relation[], public relationAuthors: string[], relationVotes: RelationVote[][],
              public isSelected = false) {
    this.lines = this.wrapText((s) => context.measureText(s).width);
    for (let i = 0; i < relations.length; i++) {
      this.relationVotes.set(relations[i].relationId, relationVotes[i] !== undefined ? relationVotes[i] : []);
    }
  }

  public setLabel(label: string, context: CanvasRenderingContext2D) {
    this.question.text = label;
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
    context.strokeStyle = DrawUtil.getColorCodeForValueInScale(this.questionVotes.map(v => v.value).reduce((p, c) => p + c, 0),
      -this.questionVotes.length, this.questionVotes.length);
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
    const totalWidth = measure(this.question.text);
    const words = [this.questionAuthor + ':'].concat(this.question.text.split(/\s+/));
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

  update(n: GraphNode): boolean {
    if (this.isEqual(n)) {
      return false;
    }
    this.question = n.question;
    this.relations = n.relations;
    this.lines = n.lines;
    this.radius = n.radius;
    this.textSize = n.textSize;
    this.bubbleScaleFactor = n.bubbleScaleFactor;
    this.questionVotes = n.questionVotes;
    this.relationVotes = n.relationVotes;
    return true;
  }

  private isEqual(n: GraphNode): boolean {
    return this.question.questionId === n.question.questionId &&
      this.question.timestampLastModified === n.question.timestampLastModified &&
      this.relations.length === n.relations.length &&
      this.relations.map(r => n.relations
        .findIndex(r2 => r2.relationId === r.relationId && r2.timestampLastModified === r.timestampLastModified) !== -1)
        .reduce((prev, cur) => prev && cur, true) &&
      this.lines.map((l, i) => l === n.lines[i]).reduce((prev, cur) => prev && cur, true) &&
      this.radius === n.radius &&
      this.textSize === n.textSize &&
      this.bubbleScaleFactor === n.bubbleScaleFactor &&
      this.questionVotes.length === n.questionVotes.length &&
      this.relations.map(r =>
        this.relationVotes.get(r.relationId).length === n.relationVotes.get(r.relationId).length &&
        this.relationVotes.get(r.relationId).map((v, i) => v.value === n.relationVotes.get(r.relationId)[i].value &&
        v.voterAgentId === n.relationVotes.get(r.relationId)[i].voterAgentId).reduce((p, c) => p && c, true)
      ).reduce((p, c) => p && c, true);
  }
}
